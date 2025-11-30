const { STATUS_CODES } = require('../constants');

class ApiError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'ApiError';
    }
}

const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        error: {
            message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
    });
};

module.exports = { ApiError, errorHandler };
