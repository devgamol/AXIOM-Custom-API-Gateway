const { DEFAULTS } = require('../shared/constants');

class MetricsBuffer {
    constructor() {
        // Map<apiKey, Buffer>
        this.buffers = new Map();
    }

    /**
     * Get or create buffer for an API key
     */
    getBuffer(apiKey) {
        if (!this.buffers.has(apiKey)) {
            this.buffers.set(apiKey, {
                count: 0,
                totalLatency: 0,
                statuses: {
                    '2xx': 0,
                    '4xx': 0,
                    '5xx': 0
                },
                blocked: 0,
                perRoute: {} // Track hits per routeId
            });
        }
        return this.buffers.get(apiKey);
    }

    /**
     * Record a metric for a specific API key
     * @param {string} apiKey - API Key
     * @param {number} latency - Request latency in ms
     * @param {number} statusCode - HTTP status code
     * @param {boolean} blocked - Whether request was blocked
     * @param {string} routeId - Route ID (optional)
     */
    recordMetric(apiKey, latency, statusCode, blocked = false, routeId = null) {
        if (!apiKey) return;

        const buffer = this.getBuffer(apiKey);

        if (blocked) {
            buffer.blocked++;
            return;
        }

        buffer.count++;
        buffer.totalLatency += latency;

        // Categorize status code
        if (statusCode >= 200 && statusCode < 300) {
            buffer.statuses['2xx']++;
        } else if (statusCode >= 400 && statusCode < 500) {
            buffer.statuses['4xx']++;
        } else if (statusCode >= 500) {
            buffer.statuses['5xx']++;
        }

        // Track per-route hits
        if (routeId) {
            buffer.perRoute[routeId] = (buffer.perRoute[routeId] || 0) + 1;
        }
    }

    /**
     * Flush metrics for all API keys and reset buffers
     * @returns {Array} Array of snapshots per API key
     */
    flushMetrics() {
        const snapshots = [];

        for (const [apiKey, buffer] of this.buffers.entries()) {
            if (buffer.count > 0 || buffer.blocked > 0) {
                snapshots.push({
                    apiKey,
                    totalRequests: buffer.count,
                    blockedRequests: buffer.blocked,
                    avgLatency: buffer.count > 0
                        ? buffer.totalLatency / buffer.count
                        : 0,
                    statusBreakdown: { ...buffer.statuses },
                    perRoute: { ...buffer.perRoute },
                    timestamp: new Date()
                });
            }
        }

        // Reset all buffers
        this.buffers.clear();

        return snapshots;
    }

    /**
     * Check if buffer has data
     * @returns {boolean}
     */
    hasData() {
        return this.buffers.size > 0;
    }
}

module.exports = MetricsBuffer;
