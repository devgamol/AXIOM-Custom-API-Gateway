const Service = require('../models/Service');
const ApiMetric = require('../models/ApiMetric');
const Log = require('../models/Log');
const { STATUS_CODES } = require('../shared/constants');

/**
 * Get dashboard stats for a specific API key
 * Shows real-time metrics including active health status
 */
exports.getApiStats = async (req, res, next) => {
    try {
        const { apiKey } = req.params;
        const ApiKey = require('../models/ApiKey');
        const apiDetails = await ApiKey.findOne({ key: apiKey });

        // Get API metrics (auto-initialized, always exists)
        let metrics = await ApiMetric.findOne({ apiKey });

        if (!metrics) {
            // Fallback - shouldn't happen if auto-init works
            metrics = await ApiMetric.create({
                apiKey,
                totalRequests: 0,
                blockedRequests: 0,
                timeseries: ApiMetric.generateEmptyTimeseries()
            });
        }

        // Get active services count from health checker
        const activeServices = await Service.countDocuments({
            apiKey,
            status: 'UP'
        });

        // Get all services to calculate real avg latency
        const services = await Service.find({ apiKey });
        const upServices = services.filter(s => s.status === 'UP');
        const avgServiceLatency = upServices.length > 0
            ? Math.round(upServices.reduce((sum, s) => sum + (s.latency || 0), 0) / upServices.length)
            : 0;

        // Get recent logs
        const recentLogs = await Log.find({ apiKey })
            .sort({ timestamp: -1 })
            .limit(10)
            .lean();

        res.status(STATUS_CODES.OK).json({
            success: true,
            data: {
                totalRequests: metrics.totalRequests,
                blockedRequests: metrics.blockedRequests,
                activeServices,
                totalServices: services.length,
                avgLatency: avgServiceLatency, // Real latency from health checks
                successRate: metrics.totalRequests > 0
                    ? Math.round(((metrics.totalRequests - metrics.blockedRequests) / metrics.totalRequests) * 100)
                    : 100,
                statusBreakdown: metrics.statusBreakdown,
                timeseries: metrics.timeseries || [],
                recent: recentLogs,
                timeseries: metrics.timeseries || [],
                recent: recentLogs,
                proxyUrl: `http://localhost:${process.env.PORT || 5000}/proxy/${apiKey}`,
                apiDetails: {
                    name: apiDetails?.name,
                    apiName: apiDetails?.apiName,
                    baseUrl: apiDetails?.baseUrl,
                    version: apiDetails?.version,
                    description: apiDetails?.description
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get services for a specific API key
 */
exports.getApiServices = async (req, res, next) => {
    try {
        const { apiKey } = req.params;

        const services = await Service.find({ apiKey });

        res.status(STATUS_CODES.OK).json({
            success: true,
            data: services
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get routes for a specific API key
 */
exports.getApiRoutes = async (req, res, next) => {
    try {
        const { apiKey } = req.params;

        const Route = require('../models/Route');
        const routes = await Route.find({ apiKey }).populate('serviceId');

        res.status(STATUS_CODES.OK).json({
            success: true,
            data: routes
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get logs for a specific API key
 */
exports.getApiLogs = async (req, res, next) => {
    try {
        const { apiKey } = req.params;
        const { page = 1, limit = 50, status } = req.query;

        const filter = { apiKey };
        if (status) filter.statusCode = parseInt(status);

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [logs, total] = await Promise.all([
            Log.find(filter)
                .sort({ timestamp: -1 })
                .skip(skip)
                .limit(parseInt(limit))
                .lean(),
            Log.countDocuments(filter)
        ]);

        res.status(STATUS_CODES.OK).json({
            success: true,
            data: {
                logs,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / parseInt(limit))
                }
            }
        });
    } catch (error) {
        next(error);
    }
};
