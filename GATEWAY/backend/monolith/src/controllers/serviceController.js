const Service = require('../models/Service');
const { ApiError } = require('../shared/utils/errorHandler');
const { STATUS_CODES } = require('../shared/constants');

// -------------------------------
// CREATE SERVICE
// -------------------------------
exports.createService = async (req, res, next) => {
    try {
        const { apiKey, name, baseUrl, description, healthPath } = req.body;

        if (!apiKey || !name || !baseUrl) {
            throw new ApiError(
                STATUS_CODES.BAD_REQUEST,
                'apiKey, name and baseUrl are required'
            );
        }

        const service = await Service.create({
            apiKey,
            name,
            baseUrl,
            healthPath: healthPath || '/',
            description,
            status: 'UNKNOWN',
            userId: req.user.id // important for isolation!
        });

        res.status(STATUS_CODES.CREATED).json({
            success: true,
            data: service
        });
    } catch (error) {
        next(error);
    }
};

// -------------------------------
// GET ALL SERVICES (USER-ISOLATED)
// -------------------------------
exports.getServices = async (req, res, next) => {
    try {
        const { apiKey } = req.query;

        const filter = { userId: req.user.id };
        if (apiKey) filter.apiKey = apiKey;

        const services = await Service.find(filter);

        res.status(STATUS_CODES.OK).json({
            success: true,
            data: services
        });
    } catch (error) {
        next(error);
    }
};

// -------------------------------
// GET SERVICE BY ID (MISSING FUNCTION — FIXED)
// -------------------------------
exports.getServiceById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const service = await Service.findOne({
            _id: id,
            userId: req.user.id
        });

        if (!service) {
            throw new ApiError(
                STATUS_CODES.NOT_FOUND,
                'Service not found'
            );
        }

        res.status(STATUS_CODES.OK).json({
            success: true,
            data: service
        });
    } catch (error) {
        next(error);
    }
};

// -------------------------------
// UPDATE SERVICE
// -------------------------------
exports.updateService = async (req, res, next) => {
    try {
        const { id } = req.params;

        const service = await Service.findOneAndUpdate(
            { _id: id, userId: req.user.id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!service) {
            throw new ApiError(
                STATUS_CODES.NOT_FOUND,
                'Service not found'
            );
        }

        res.status(STATUS_CODES.OK).json({
            success: true,
            data: service
        });
    } catch (error) {
        next(error);
    }
};

// -------------------------------
// DELETE SERVICE
// -------------------------------
exports.deleteService = async (req, res, next) => {
    try {
        const { id } = req.params;

        const service = await Service.findOneAndDelete({
            _id: id,
            userId: req.user.id
        });

        if (!service) {
            throw new ApiError(
                STATUS_CODES.NOT_FOUND,
                'Service not found'
            );
        }

        res.status(STATUS_CODES.OK).json({
            success: true,
            message: 'Service deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
