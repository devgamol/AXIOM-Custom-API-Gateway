const Route = require('../models/Route');
const { checkRateLimit: checkRateLimitService } = require('../services/internalServices');
const { STATUS_CODES } = require('../shared/constants');

// Rate limiting check endpoint
exports.checkRateLimit = async (req, res, next) => {
    try {
        const { apiKey, routeId } = req.body;

        if (!apiKey || !routeId) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                error: 'apiKey and routeId are required'
            });
        }

        // 1️⃣ Fetch route from DB to get correct rate limit
        const route = await Route.findById(routeId).lean();

        if (!route) {
            return res.status(STATUS_CODES.NOT_FOUND).json({
                success: false,
                error: 'Route not found'
            });
        }

        // 2️⃣ Read rate limit from DB
        const limit = route.rateLimit;

        // 3️⃣ Check rate limit through service
        const result = await checkRateLimitService(apiKey, routeId, limit);

        res.status(STATUS_CODES.OK).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};
