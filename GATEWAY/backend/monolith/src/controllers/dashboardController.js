const Service = require('../models/Service');
const Metric = require('../models/Metric');
const Log = require('../models/Log');
const ApiKey = require('../models/ApiKey');
const { STATUS_CODES } = require('../shared/constants');

/**
 * Get comprehensive dashboard statistics
 * Aggregates metrics, services, logs for dashboard overview
 */
exports.getDashboardStats = async (req, res, next) => {
    try {
        // Get aggregated metrics (last 24 hours)
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const [metricsAgg, servicesCount, recentLogs, timeseries, apiKeysCount] = await Promise.all([
            // Aggregated metrics
            Metric.aggregate([
                { $match: { timestamp: { $gte: oneDayAgo } } },
                {
                    $group: {
                        _id: null,
                        totalRequests: { $sum: '$totalRequests' },
                        blockedRequests: { $sum: '$blockedRequests' },
                        avgLatency: { $avg: '$avgLatency' },
                        status2xx: { $sum: '$statusBreakdown.2xx' },
                        status4xx: { $sum: '$statusBreakdown.4xx' },
                        status5xx: { $sum: '$statusBreakdown.5xx' }
                    }
                }
            ]),

            // Active services count
            Service.countDocuments({ status: 'UP' }),

            // Recent logs (last 10)
            Log.find().sort({ timestamp: -1 }).limit(10).lean(),

            // Time series data (last 24 hours, hourly buckets)
            Metric.aggregate([
                { $match: { timestamp: { $gte: oneDayAgo } } },
                {
                    $group: {
                        _id: {
                            $dateToString: {
                                format: '%Y-%m-%d-%H',
                                date: '$timestamp'
                            }
                        },
                        count: { $sum: '$totalRequests' },
                        timestamp: { $first: '$timestamp' }
                    }
                },
                { $sort: { timestamp: 1 } },
                {
                    $project: {
                        _id: 0,
                        ts: '$_id',
                        count: 1
                    }
                }
            ]),

            // Total API keys count
            ApiKey.countDocuments({ isActive: true })
        ]);

        const metrics = metricsAgg[0] || {
            totalRequests: 0,
            blockedRequests: 0,
            avgLatency: 0,
            status2xx: 0,
            status4xx: 0,
            status5xx: 0
        };

        res.status(STATUS_CODES.OK).json({
            success: true,
            data: {
                totalRequests: metrics.totalRequests,
                blockedRequests: metrics.blockedRequests,
                activeServices: servicesCount,
                activeApiKeys: apiKeysCount,
                averageLatency: Math.round(metrics.avgLatency),
                successRate: metrics.totalRequests > 0
                    ? Math.round(((metrics.totalRequests - metrics.blockedRequests) / metrics.totalRequests) * 100)
                    : 100,
                statusBreakdown: {
                    '2xx': metrics.status2xx,
                    '4xx': metrics.status4xx,
                    '5xx': metrics.status5xx
                },
                recent: recentLogs,
                timeseries,
                proxyUrl: `http://localhost:${process.env.PORT || 5000}/proxy/{your-api-key}`
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get user-specific dashboard stats
 * Filters by userId from JWT token
 */
exports.getUserDashboardStats = async (req, res, next) => {
    try {
        const { userId } = req;

        // Get user's API keys
        const userApiKeys = await ApiKey.find({ userId, isActive: true }).select('key');
        const apiKeyValues = userApiKeys.map(k => k.key);

        if (apiKeyValues.length === 0) {
            return res.status(STATUS_CODES.OK).json({
                success: true,
                data: {
                    totalRequests: 0,
                    blockedRequests: 0,
                    activeServices: 0,
                    activeApiKeys: 0,
                    averageLatency: 0,
                    successRate: 100,
                    statusBreakdown: { '2xx': 0, '4xx': 0, '5xx': 0 },
                    recent: [],
                    timeseries: [],
                    proxyUrl: `http://localhost:${process.env.PORT || 5000}/proxy/{your-api-key}`
                }
            });
        }

        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const [metricsAgg, servicesCount, recentLogs, timeseries] = await Promise.all([
            // User metrics
            Metric.aggregate([
                {
                    $match: {
                        apiKey: { $in: apiKeyValues },
                        timestamp: { $gte: oneDayAgo }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalRequests: { $sum: '$totalRequests' },
                        blockedRequests: { $sum: '$blockedRequests' },
                        avgLatency: { $avg: '$avgLatency' },
                        status2xx: { $sum: '$statusBreakdown.2xx' },
                        status4xx: { $sum: '$statusBreakdown.4xx' },
                        status5xx: { $sum: '$statusBreakdown.5xx' }
                    }
                }
            ]),

            Service.countDocuments({ status: 'UP' }),

            Log.find({ apiKey: { $in: apiKeyValues } })
                .sort({ timestamp: -1 })
                .limit(10)
                .lean(),

            Metric.aggregate([
                {
                    $match: {
                        apiKey: { $in: apiKeyValues },
                        timestamp: { $gte: oneDayAgo }
                    }
                },
                {
                    $group: {
                        _id: {
                            $dateToString: {
                                format: '%Y-%m-%d-%H',
                                date: '$timestamp'
                            }
                        },
                        count: { $sum: '$totalRequests' },
                        timestamp: { $first: '$timestamp' }
                    }
                },
                { $sort: { timestamp: 1 } },
                {
                    $project: {
                        _id: 0,
                        ts: '$_id',
                        count: 1
                    }
                }
            ])
        ]);

        const metrics = metricsAgg[0] || {
            totalRequests: 0,
            blockedRequests: 0,
            avgLatency: 0,
            status2xx: 0,
            status4xx: 0,
            status5xx: 0
        };

        res.status(STATUS_CODES.OK).json({
            success: true,
            data: {
                totalRequests: metrics.totalRequests,
                blockedRequests: metrics.blockedRequests,
                activeServices: servicesCount,
                activeApiKeys: userApiKeys.length,
                averageLatency: Math.round(metrics.avgLatency),
                successRate: metrics.totalRequests > 0
                    ? Math.round(((metrics.totalRequests - metrics.blockedRequests) / metrics.totalRequests) * 100)
                    : 100,
                statusBreakdown: {
                    '2xx': metrics.status2xx,
                    '4xx': metrics.status4xx,
                    '5xx': metrics.status5xx
                },
                recent: recentLogs,
                timeseries,
                proxyUrl: `http://localhost:${process.env.PORT || 5000}/proxy/{your-api-key}`
            }
        });
    } catch (error) {
        next(error);
    }
};
