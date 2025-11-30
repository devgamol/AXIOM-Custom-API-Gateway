const Joi = require('joi');
const { ApiError } = require('../shared/utils/errorHandler');
const { STATUS_CODES } = require('../shared/constants');

/**
 * Joi validation schemas for different entities
 */

// Service validation schema
const serviceSchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    baseUrl: Joi.string().uri().required(),
    description: Joi.string().max(500).allow(''),
    status: Joi.string().valid('UP', 'DOWN').default('UP'),
    avgLatency: Joi.number().min(0)
});

// Route validation schema
const routeSchema = Joi.object({
    path: Joi.string().pattern(/^\//).required().messages({
        'string.pattern.base': 'Path must start with /'
    }),
    method: Joi.string().valid('GET', 'POST', 'PUT', 'DELETE', 'PATCH').required(),
    serviceId: Joi.string().required(),
    destinationPath: Joi.string().pattern(/^\//),
    isActive: Joi.boolean().default(true),
    rateLimit: Joi.number().min(1).max(10000).default(100)
});

// API Key validation schema
const apiKeySchema = Joi.object({
    userId: Joi.string().required(),
    name: Joi.string().min(3).max(100).required()
});

// Rate Limit validation schema
const rateLimitSchema = Joi.object({
    apiKey: Joi.string().required(),
    routeId: Joi.string().required(),
    limit: Joi.number().min(1).max(10000).required()
});

/**
 * Middleware factory to validate request body
 * @param {Joi.Schema} schema - Joi validation schema
 * @returns {Function} Express middleware
 */
const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const errorMessage = error.details.map(d => d.message).join(', ');
            return next(new ApiError(STATUS_CODES.BAD_REQUEST, errorMessage));
        }

        req.validatedBody = value;
        next();
    };
};

module.exports = {
    validateService: validate(serviceSchema),
    validateRoute: validate(routeSchema),
    validateApiKey: validate(apiKeySchema),
    validateRateLimit: validate(rateLimitSchema),
    validate
};
