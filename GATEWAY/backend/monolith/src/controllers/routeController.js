const Route = require('../models/Route');
const { ApiError } = require('../shared/utils/errorHandler');
const { STATUS_CODES } = require('../shared/constants');

const normalizeRoute = (route) => {
    if (!route) return null;
    const { _id, __v, ...rest } = route;
    return { id: _id, ...rest };
};

// CREATE ROUTE
exports.createRoute = async (req, res, next) => {
    try {
        let {
            apiKey,
            path,
            method,
            serviceId,
            destinationPath,
            rateLimit,
            rateLimitPerMinute
        } = req.body;

        if (!apiKey || !path || !method || !serviceId) {
            throw new ApiError(
                STATUS_CODES.BAD_REQUEST,
                'apiKey, path, method, and serviceId are required'
            );
        }

        const computedRateLimit = rateLimit || rateLimitPerMinute;

        const route = await Route.create({
            apiKey,
            path,
            method: method.toUpperCase(),
            serviceId,
            destinationPath,
            rateLimit: computedRateLimit,
            userId: req.user.id   // ✅ FIX
        });

        res.status(STATUS_CODES.CREATED).json({
            success: true,
            data: normalizeRoute(route.toObject())
        });
    } catch (error) {
        next(error);
    }
};

// GET ROUTES
exports.getRoutes = async (req, res, next) => {
    try {
        const { apiKey } = req.query;

        const filter = { userId: req.user.id, isActive: true };   // ✅ FIX
        if (apiKey) filter.apiKey = apiKey;

        const routes = await Route.find(filter)
            .populate('serviceId', 'name')
            .lean();

        res.status(STATUS_CODES.OK).json({
            success: true,
            data: routes.map(normalizeRoute)
        });
    } catch (error) {
        next(error);
    }
};

// GET SINGLE ROUTE
exports.getRoute = async (req, res, next) => {
    try {
        const { id } = req.params;

        const route = await Route.findOne({
            _id: id,
            userId: req.user.id
        }).populate('serviceId', 'name');

        if (!route) {
            throw new ApiError(STATUS_CODES.NOT_FOUND, 'Route not found');
        }

        res.status(STATUS_CODES.OK).json({
            success: true,
            data: normalizeRoute(route.toObject())
        });
    } catch (error) {
        next(error);
    }
};

// LOOKUP ROUTE (Public/Internal)
exports.lookupRoute = async (req, res, next) => {
    try {
        const { path, method } = req.query;

        if (!path || !method) {
            throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Path and method are required');
        }

        // Find route matching path and method
        // This is a simplified lookup. In a real gateway, you might need regex matching.
        const route = await Route.findOne({
            path,
            method: method.toUpperCase(),
            isActive: true
        }).populate('serviceId');

        if (!route) {
            throw new ApiError(STATUS_CODES.NOT_FOUND, 'Route not found');
        }

        res.status(STATUS_CODES.OK).json({
            success: true,
            data: normalizeRoute(route.toObject())
        });
    } catch (error) {
        next(error);
    }
};

// UPDATE ROUTE
exports.updateRoute = async (req, res, next) => {
    try {
        const { id } = req.params;

        const updates = req.body;
        if (updates.method) updates.method = updates.method.toUpperCase();
        if (updates.rateLimitPerMinute)
            updates.rateLimit = updates.rateLimitPerMinute;

        const route = await Route.findOneAndUpdate(
            { _id: id, userId: req.user.id },  // ✅ FIX
            updates,
            { new: true, runValidators: true }
        )
            .populate('serviceId', 'name')
            .lean();

        if (!route) {
            throw new ApiError(STATUS_CODES.NOT_FOUND, 'Route not found');
        }

        res.status(STATUS_CODES.OK).json({
            success: true,
            data: normalizeRoute(route)
        });
    } catch (error) {
        next(error);
    }
};

// DELETE ROUTE
exports.deleteRoute = async (req, res, next) => {
    try {
        const { id } = req.params;

        const route = await Route.findOneAndUpdate(
            { _id: id, userId: req.user.id },   // ✅ FIX
            { isActive: false }
        );

        if (!route) {
            throw new ApiError(STATUS_CODES.NOT_FOUND, 'Route not found');
        }

        res.status(STATUS_CODES.OK).json({
            success: true,
            message: 'Route deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
