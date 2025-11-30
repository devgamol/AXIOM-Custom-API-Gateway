const Log = require('../models/Log');
const { STATUS_CODES, DEFAULTS } = require('../shared/constants');

// Create log entry
exports.createLog = async (req, res, next) => {
    try {
        const logData = req.body;

        const log = await Log.create(logData);

        res.status(STATUS_CODES.CREATED).json({
            success: true,
            data: log
        });
    } catch (error) {
        next(error);
    }
};

// Get logs, optionally filtered
exports.getLogs = async (req, res, next) => {
    try {
        const { apiKey, status, from, to, page = 1, limit = 50 } = req.query;

        // Build filter
        const filter = {};

        if (apiKey) filter.apiKey = apiKey;
        if (status) {
            const statusCode = parseInt(status);
            if (!isNaN(statusCode)) {
                filter.statusCode = statusCode;
            }
        }
        if (from || to) {
            filter.timestamp = {};
            if (from) filter.timestamp.$gte = new Date(from);
            if (to) filter.timestamp.$lte = new Date(to);
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Execute query with pagination
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
