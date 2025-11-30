// backend/monolith/src/controllers/apiKeyController.js

const crypto = require('crypto');
const ApiKey = require('../models/ApiKey');
const ApiMetric = require('../models/ApiMetric');
const { ApiError } = require('../shared/utils/errorHandler');
const { STATUS_CODES, API_KEY_LENGTH } = require('../shared/constants');

// Helper: generate random key
const generateApiKey = () => {
    return crypto.randomBytes(API_KEY_LENGTH).toString('hex');
};

// CREATE API KEY
exports.createApiKey = async (req, res, next) => {
    try {
        const { name, apiName, baseUrl, description, version, healthPath } = req.body;

        if (!name) {
            throw new ApiError(STATUS_CODES.BAD_REQUEST, 'name is required');
        }

        const key = generateApiKey();

        const apiKey = await ApiKey.create({
            userId: req.user && req.user.id ? req.user.id : null, // defensive
            key,
            name,
            apiName: apiName || name,
            baseUrl,
            description,
            version,
            healthPath
        });

        // Initialize metrics for this new API key (if model exists)
        try {
            await ApiMetric.create({
                apiKey: key,
                totalRequests: 0,
                blockedRequests: 0,
                totalLatency: 0,
                avgLatency: 0,
                statusBreakdown: { '2xx': 0, '4xx': 0, '5xx': 0 },
                timeseries: typeof ApiMetric.generateEmptyTimeseries === 'function'
                    ? ApiMetric.generateEmptyTimeseries()
                    : [],
                routes: {}
            });
        } catch (e) {
            // metric init is non-fatal — log and continue
            console.warn('[apiKeyController] failed to create initial ApiMetric', e.message || e);
        }

        res.status(STATUS_CODES.CREATED).json({
            success: true,
            data: apiKey
        });
    } catch (error) {
        next(error);
    }
};

// GET API KEYS FOR USER
exports.getApiKeys = async (req, res, next) => {
    try {
        // If route is called with :userId param, we should ensure it's the same as auth user
        // But to maintain behaviour, prefer authenticated user if present.
        const requestedUserId = req.params.userId;
        const userId = (req.user && req.user.id) ? req.user.id : requestedUserId;

        const apiKeys = await ApiKey.find({
            userId,
            isActive: true
        });

        res.status(STATUS_CODES.OK).json({
            success: true,
            data: apiKeys
        });
    } catch (error) {
        next(error);
    }
};

// VALIDATE API KEY (public for gateway)
exports.validateApiKey = async (req, res, next) => {
    try {
        const { apiKey } = req.params;

        const key = await ApiKey.findOne({ key: apiKey, isActive: true });

        if (!key) {
            return res.status(STATUS_CODES.OK).json({
                success: true,
                data: { valid: false }
            });
        }

        res.status(STATUS_CODES.OK).json({
            success: true,
            data: {
                valid: true,
                apiKey: key
            }
        });
    } catch (error) {
        next(error);
    }
};

// ROTATE API KEY
exports.rotateApiKey = async (req, res, next) => {
    try {
        const { id } = req.params;

        const apiKey = await ApiKey.findById(id);
        if (!apiKey) {
            throw new ApiError(STATUS_CODES.NOT_FOUND, 'API Key not found');
        }

        // Ensure ownership: only owner may rotate
        if (req.user && req.user.id && String(apiKey.userId) !== String(req.user.id)) {
            throw new ApiError(STATUS_CODES.FORBIDDEN, 'Not allowed');
        }

        apiKey.key = generateApiKey();
        await apiKey.save();

        res.status(STATUS_CODES.OK).json({
            success: true,
            data: apiKey
        });
    } catch (error) {
        next(error);
    }
};

// UPDATE API KEY STATS (internal)
exports.updateStats = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { totalRequests, blockedRequests, averageLatency } = req.body;

        const apiKey = await ApiKey.findById(id);
        if (!apiKey) {
            throw new ApiError(STATUS_CODES.NOT_FOUND, 'API Key not found');
        }

        // Update numeric counters if provided
        if (totalRequests !== undefined) apiKey.totalRequests = (apiKey.totalRequests || 0) + totalRequests;
        if (blockedRequests !== undefined) apiKey.blockedRequests = (apiKey.blockedRequests || 0) + blockedRequests;

        if (averageLatency !== undefined) {
            // simple running average approach (defensive)
            const prevTotal = apiKey.totalRequests || totalRequests || 0;
            const prevAvg = apiKey.averageLatency || 0;
            const newTotal = prevTotal + (totalRequests || 0);
            apiKey.averageLatency = newTotal ? ((prevAvg * prevTotal) + (averageLatency * (totalRequests || 0))) / newTotal : prevAvg;
        }

        await apiKey.save();

        res.status(STATUS_CODES.OK).json({
            success: true,
            data: apiKey
        });
    } catch (error) {
        next(error);
    }
};

// DELETE API KEY (soft)
exports.deleteApiKey = async (req, res, next) => {
    try {
        const { id } = req.params;

        const apiKey = await ApiKey.findById(id);
        if (!apiKey) {
            throw new ApiError(STATUS_CODES.NOT_FOUND, 'API Key not found');
        }

        // Ensure ownership: only owner may delete
        if (req.user && req.user.id && String(apiKey.userId) !== String(req.user.id)) {
            throw new ApiError(STATUS_CODES.FORBIDDEN, 'Not allowed');
        }

        apiKey.isActive = false;
        await apiKey.save();

        res.status(STATUS_CODES.OK).json({
            success: true,
            message: 'API Key deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
