module.exports = {
    // HTTP Status Codes
    STATUS_CODES: {
        OK: 200,
        CREATED: 201,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        TOO_MANY_REQUESTS: 429,
        INTERNAL_SERVER_ERROR: 500,
        SERVICE_UNAVAILABLE: 503
    },

    // Service Status
    SERVICE_STATUS: {
        UP: 'UP',
        DOWN: 'DOWN'
    },

    // HTTP Methods
    HTTP_METHODS: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],

    // Default Values
    DEFAULTS: {
        RATE_LIMIT: 100, // requests per minute
        PAGE_SIZE: 20,
        CACHE_TTL: {
            ROUTE: 5, // seconds
            SERVICE: 5,
            API_KEY: 10
        },
        METRICS_FLUSH_INTERVAL: 5000 // 5 seconds in ms
    },

    // JWT
    JWT_EXPIRES_IN: '24h',

    // API Key
    API_KEY_LENGTH: 32
};
