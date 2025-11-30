const Metric = require('../models/Metric');
const { STATUS_CODES } = require('../shared/constants');

// Create metric entry (batch from gateway)
exports.createMetric = async (req, res, next) => {
    try {
        const metricData = req.body;

        const metric = await Metric.create(metricData);

        res.status(STATUS_CODES.CREATED).json({
            success: true,
            data: metric
        });
    } catch (error) {
        next(error);
    }
};

// Get metrics by API key with time range
exports.getMetrics = async (req, res, next) => {
    try {
        const { apiKey } = req.params;
        const { from, to } = req.query;

        // Build filter
        const filter = {};

        if (apiKey && apiKey !== 'all') {
            filter.apiKey = apiKey;
        }

        if (from || to) {
            filter.timestamp = {};
            if (from) {
                filter.timestamp.$gte = new Date(from);
            }
            if (to) {
                filter.timestamp.$lte = new Date(to);
            }
        }

        const metrics = await Metric.find(filter).sort({ timestamp: -1 });

        // Calculate aggregated stats
        const aggregated = {
            totalRequests: 0,
            blockedRequests: 0,
            avgLatency: 0,
            statusBreakdown: {
                '2xx': 0,
                '4xx': 0,
                '5xx': 0
            }
        };

        let totalLatencySum = 0;
        let metricsCount = metrics.length;

        metrics.forEach(metric => {
            aggregated.totalRequests += metric.totalRequests;
            aggregated.blockedRequests += metric.blockedRequests;
            totalLatencySum += metric.avgLatency * metric.totalRequests;

            aggregated.statusBreakdown['2xx'] += metric.statusBreakdown['2xx'] || 0;
            aggregated.statusBreakdown['4xx'] += metric.statusBreakdown['4xx'] || 0;
            aggregated.statusBreakdown['5xx'] += metric.statusBreakdown['5xx'] || 0;
        });

        if (aggregated.totalRequests > 0) {
            aggregated.avgLatency = totalLatencySum / aggregated.totalRequests;
        }

        res.status(STATUS_CODES.OK).json({
            success: true,
            data: {
                metrics,
                aggregated
            }
        });
    } catch (error) {
        next(error);
    }
};
