const ApiKey = require('../models/ApiKey');
const Route = require('../models/Route');
const Service = require('../models/Service');
const Log = require('../models/Log');
const Metric = require('../models/Metric');
const ApiMetric = require('../models/ApiMetric');
const { routeCache, serviceCache, apiKeyCache } = require('../utils/cache');

// In-memory rate limiting store
// Structure: { [apiKey:routeId]: [timestamp1, timestamp2, ...] }
const rateLimitStore = new Map();

// Cleanup expired entries periodically (every 1 minute)
setInterval(() => {
    const now = Date.now();
    const windowSize = 60 * 1000; // 1 minute

    for (const [key, entries] of rateLimitStore.entries()) {
        const windowStart = now - windowSize;
        const validEntries = entries.filter(timestamp => timestamp > windowStart);

        if (validEntries.length === 0) {
            rateLimitStore.delete(key);
        } else {
            rateLimitStore.set(key, validEntries);
        }
    }
}, 60 * 1000);

/**
 * Validate API key (with caching)
 */
const validateApiKey = async (apiKey) => {
    // Check cache first
    const cached = apiKeyCache.get(apiKey);
    if (cached !== undefined) {
        return cached;
    }

    // Fetch from DB
    const key = await ApiKey.findOne({ key: apiKey, isActive: true });

    const result = key ? { valid: true, apiKey: key } : { valid: false };

    // Cache the result
    apiKeyCache.set(apiKey, result);

    return result;
};

/**
 * Check rate limit (In-Memory Sliding Window)
 * Option B from spec
 */
const checkRateLimit = async (apiKey, routeId, limit) => {
    try {
        const key = `rate_limit:${apiKey}:${routeId}`;
        const now = Date.now();
        const windowSize = 60 * 1000; // 1 minute
        const windowStart = now - windowSize;

        // Get current entries for this key
        let entries = rateLimitStore.get(key) || [];

        // Remove old entries outside the window
        // This is the "Sliding Window" part - we only count requests in the last minute
        entries = entries.filter(timestamp => timestamp > windowStart);

        const currentCount = entries.length;

        if (currentCount >= limit) {
            // Rate limit exceeded
            const oldestEntry = entries[0] || now;
            const resetAt = oldestEntry + windowSize;

            return {
                allowed: false,
                remaining: 0,
                resetAt: new Date(resetAt).toISOString()
            };
        }

        // Add current request
        entries.push(now);
        rateLimitStore.set(key, entries);

        const remaining = limit - currentCount - 1;
        const resetAt = now + windowSize;

        return {
            allowed: true,
            remaining,
            resetAt: new Date(resetAt).toISOString()
        };
    } catch (error) {
        console.warn('Rate limit check failed (allowing request):', error.message);
        return { allowed: true, remaining: limit, resetAt: Date.now() + 60000 };
    }
};

/**
 * Lookup route (with caching)
 */
/**
 * Lookup route (with caching)
 */
const lookupRoute = async (apiKey, path, method) => {
    const cacheKey = `${apiKey}:${path}:${method}`;

    // Check cache first
    const cached = routeCache.get(cacheKey);
    if (cached !== undefined) {
        return cached;
    }

    // Fetch from DB
    const route = await Route.findOne({
        apiKey,
        path,
        method: method.toUpperCase(),
        isActive: true
    }).populate('serviceId');

    // Cache the result
    if (route) {
        routeCache.set(cacheKey, route);
    }

    return route;
};

/**
 * Get service with caching
 */
const getService = async (serviceId) => {
    const cached = serviceCache.get(serviceId.toString());
    if (cached) return cached;

    const service = await Service.findById(serviceId);
    if (service) {
        serviceCache.set(serviceId.toString(), service);
    }
    return service;
};

/**
 * Create log entry
 */
const createLog = async (logData) => {
    try {
        await Log.create(logData);
    } catch (error) {
        console.error('Failed to create log:', error.message);
    }
};

/**
 * Send metrics (update ApiMetric entry)
 */
const sendMetrics = async (metricsData) => {
    try {
        const { apiKey, totalRequests, blockedRequests, avgLatency, statusBreakdown, perRoute, timestamp } = metricsData;

        if (!apiKey) return;

        const currentHour = new Date(timestamp).toISOString().slice(0, 13).replace('T', '-');

        // Prepare per-route updates
        const routeUpdates = {};
        if (perRoute) {
            for (const [routeId, count] of Object.entries(perRoute)) {
                routeUpdates[`routes.${routeId}.count`] = count;
                // We don't have latency per route in buffer yet, but we can add it later if needed
                // For now just increment count
            }
        }

        // Update ApiMetric
        const updateQuery = {
            $inc: {
                totalRequests: totalRequests,
                blockedRequests: blockedRequests,
                totalLatency: avgLatency * totalRequests,
                [`statusBreakdown.2xx`]: statusBreakdown['2xx'],
                [`statusBreakdown.4xx`]: statusBreakdown['4xx'],
                [`statusBreakdown.5xx`]: statusBreakdown['5xx'],
                ...routeUpdates
            },
            $set: {
                updatedAt: new Date()
            }
        };

        await ApiMetric.findOneAndUpdate(
            { apiKey },
            updateQuery,
            { upsert: true, new: true }
        );

        // Better approach for timeseries:
        // We need to find the bucket for currentHour and increment it.
        // If not found, push it.

        const metric = await ApiMetric.findOne({ apiKey });
        if (metric) {
            // Update avgLatency
            if (metric.totalRequests > 0) {
                metric.avgLatency = metric.totalLatency / metric.totalRequests;
            }

            // Update timeseries - find bucket by matching hour string
            const bucketIndex = metric.timeseries.findIndex(t => {
                const bucketHour = new Date(t.timestamp).toISOString().slice(0, 13).replace('T', '-');
                return bucketHour === currentHour;
            });

            if (bucketIndex >= 0) {
                metric.timeseries[bucketIndex].count += totalRequests;
                metric.timeseries[bucketIndex].latency = avgLatency;
            } else {
                // Add new bucket, remove oldest if > 24
                metric.timeseries.push({
                    timestamp: new Date(timestamp),
                    count: totalRequests,
                    latency: avgLatency
                });
                if (metric.timeseries.length > 24) {
                    metric.timeseries.shift(); // Remove oldest
                }
            }

            await metric.save();
        }

    } catch (error) {
        console.error('Failed to update metrics:', error.message);
    }
};

/**
 * Update API key stats
 */
const updateApiKeyStats = async (apiKeyId, stats) => {
    try {
        const apiKey = await ApiKey.findById(apiKeyId);
        if (apiKey) {
            if (stats.totalRequests) apiKey.totalRequests += stats.totalRequests;
            if (stats.blockedRequests) apiKey.blockedRequests += stats.blockedRequests;
            if (stats.averageLatency) {
                const totalCount = apiKey.totalRequests; // Already incremented? No, stats has the increment.
                // Wait, the logic in controller was:
                // const totalCount = apiKey.totalRequests + totalRequests;
                // apiKey.averageLatency = ((apiKey.averageLatency * apiKey.totalRequests) + (averageLatency * totalRequests)) / totalCount;

                // Here we are just passing stats. Let's replicate the logic properly.
                // The stats object passed from proxyHandler is { totalRequests: 1, ... }

                // Re-reading controller logic:
                // apiKey.totalRequests += totalRequests;
                // ...
                // const totalCount = apiKey.totalRequests + totalRequests; // This seems wrong in controller if it already added it.
                // Controller logic:
                // if (totalRequests !== undefined) apiKey.totalRequests += totalRequests;
                // if (averageLatency !== undefined) {
                //    const totalCount = apiKey.totalRequests + totalRequests; // This adds it AGAIN?
                //    // Ah, apiKey.totalRequests is the OLD value before save? No, it was modified line above.
                //    // Let's just use a simplified update here.

                // Simplified:
                const oldTotal = apiKey.totalRequests - (stats.totalRequests || 0); // Backtrack to get previous total?
                // Actually, let's just do a simple weighted average if possible, or just update it.
                // Since this is "fire and forget" stats, exact precision isn't critical.

                if (apiKey.totalRequests > 0) {
                    apiKey.averageLatency = ((apiKey.averageLatency * (apiKey.totalRequests - stats.totalRequests)) + (stats.averageLatency * stats.totalRequests)) / apiKey.totalRequests;
                } else {
                    apiKey.averageLatency = stats.averageLatency;
                }
            }
            await apiKey.save();
        }
    } catch (error) {
        console.error('Failed to update API key stats:', error.message);
    }
};

module.exports = {
    validateApiKey,
    checkRateLimit,
    lookupRoute,
    createLog,
    sendMetrics,
    updateApiKeyStats,
    getService
};
