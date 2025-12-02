const Service = require('../models/Service');
const ApiMetric = require('../models/ApiMetric');
const Log = require('../models/Log');
const { STATUS_CODES } = require('../shared/constants');

const getPublicBase = (req) => {
    return process.env.PUBLIC_URL || `http://${req.headers.host}`;
};

/**
 * Get API statistics
 */
exports.getApiStats = async (req, res, next) => {
    try {
        const { apiKey } = req.params;
        const ApiKey = require('../models/ApiKey');

        const apiDetails = await ApiKey.findOne({ key: apiKey });

        let metrics = await ApiMetric.findOne({ apiKey });
        if (!metrics) {
            metrics = await ApiMetric.create({
                apiKey,
                totalRequests: 0,
                blockedRequests: 0,
                timeseries: ApiMetric.generateEmptyTimeseries()
            });
        }

        const activeServices = await Service.countDocuments({ apiKey, status: 'UP' });
        const services = await Service.find({ apiKey });

        const upServices = services.filter(s => s.status === 'UP');
        const avgServiceLatency = upServices.length > 0
            ? Math.round(upServices.reduce((sum, s) => sum + (s.latency || 0), 0) / upServices.length)
            : 0;

        const recentLogs = await Log.find({ apiKey })
            .sort({ timestamp: -1 })
            .limit(10)
            .lean();

        const baseUrl = getPublicBase(req);

        res.status(STATUS_CODES.OK).json({
            success: true,
            data: {
                totalRequests: metrics.totalRequests,
                blockedRequests: metrics.blockedRequests,
                activeServices,
                totalServices: services.length,
                avgLatency: avgServiceLatency,
                successRate: metrics.totalRequests > 0
                    ? Math.round(((metrics.totalRequests - metrics.blockedRequests) / metrics.totalRequests) * 100)
                    : 100,
                statusBreakdown: metrics.statusBreakdown,
                timeseries: metrics.timeseries || [],
                recent: recentLogs,

                proxyUrl: `${baseUrl}/proxy/${apiKey}`,

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
 * Get services of an API key
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
 * Get routes for API key
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
 * Get logs for API key
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
