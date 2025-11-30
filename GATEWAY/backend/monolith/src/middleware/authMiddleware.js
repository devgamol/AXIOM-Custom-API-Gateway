const jwt = require('jsonwebtoken');
const { ApiError } = require('../shared/utils/errorHandler');
const { STATUS_CODES } = require('../shared/constants');

exports.authenticate = (req, res, next) => {
    try {
        const header = req.headers.authorization;

        if (!header || !header.startsWith("Bearer "))
            throw new ApiError(STATUS_CODES.UNAUTHORIZED, "No token provided");

        const token = header.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // FINAL STRUCTURE USED BY ALL ROUTES
        req.user = {
            id: decoded.userId,              // Correct ID (matches token)
            email: decoded.email || null     // Optional
        };

        next();
    } catch (err) {
        if (err.name === "JsonWebTokenError")
            next(new ApiError(STATUS_CODES.UNAUTHORIZED, "Invalid token"));
        else if (err.name === "TokenExpiredError")
            next(new ApiError(STATUS_CODES.UNAUTHORIZED, "Token expired"));
        else
            next(err);
    }
};
