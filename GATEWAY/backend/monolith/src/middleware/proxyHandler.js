const axios = require('axios');
const {
    validateApiKey,
    checkRateLimit,
    lookupRoute,
    createLog,
    updateApiKeyStats,
    getService
} = require('../services/internalServices');
const { STATUS_CODES } = require('../shared/constants');

/**
 * Main proxy handler middleware
 * Handles the complete request flow through the gateway
 */
const proxyHandler = (metricsBuffer) => async (req, res, next) => {
    const startTime = Date.now();
    let apiKeyData = null;
    let routeData = null;

    try {
        // Extract API key from URL
        const apiKey = req.params.apiKey;
        if (!apiKey) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                error: 'API key is required'
            });
        }

        // Step 1: Validate API key
        const apiKeyValidation = await validateApiKey(apiKey);
        if (!apiKeyValidation || !apiKeyValidation.valid) {
            metricsBuffer.recordMetric(apiKey, 0, STATUS_CODES.UNAUTHORIZED, true);
            return res.status(STATUS_CODES.UNAUTHORIZED).json({
                success: false,
                error: 'Invalid API key'
            });
        }

        apiKeyData = apiKeyValidation.apiKey;

        // Extract path (everything after /proxy/:apiKey/)
        const requestPath = '/' + (req.params[0] || '');
        const method = req.method;

        // Step 2: Lookup route
        routeData = await lookupRoute(apiKey, requestPath, method);
        if (!routeData) {
            const latency = Date.now() - startTime;
            metricsBuffer.recordMetric(apiKey, latency, STATUS_CODES.NOT_FOUND);

            // Log the request
            createLog({
                timestamp: new Date(),
                method,
                endpoint: requestPath,
                statusCode: STATUS_CODES.NOT_FOUND,
                latency,
                apiKey,
                error: 'Route not found'
            });

            return res.status(STATUS_CODES.NOT_FOUND).json({
                success: false,
                error: 'Route not found'
            });
        }

        // Step 3: Check rate limit
        const rateLimitResult = await checkRateLimit(
            apiKey,
            routeData._id.toString(),
            routeData.rateLimit
        );

        if (!rateLimitResult.allowed) {
            const latency = Date.now() - startTime;
            metricsBuffer.recordMetric(apiKey, latency, STATUS_CODES.TOO_MANY_REQUESTS, true);

            // Log blocked request
            createLog({
                timestamp: new Date(),
                method,
                endpoint: requestPath,
                statusCode: STATUS_CODES.TOO_MANY_REQUESTS,
                latency,
                apiKey,
                error: 'Rate limit exceeded'
            });

            // Update API key stats for blocked request
            updateApiKeyStats(apiKeyData._id, {
                totalRequests: 0,
                blockedRequests: 1,
                averageLatency: 0
            });

            return res.status(STATUS_CODES.TOO_MANY_REQUESTS).json({
                success: false,
                error: 'Rate limit exceeded',
                resetAt: rateLimitResult.resetAt
            });
        }

        // Step 3: Get Service (fresh status)
        const service = await getService(routeData.serviceId._id || routeData.serviceId);

        if (!service) {
            const latency = Date.now() - startTime;
            metricsBuffer.recordMetric(apiKey, latency, STATUS_CODES.BAD_GATEWAY);
            createLog({
                timestamp: new Date(),
                method,
                endpoint: requestPath,
                statusCode: STATUS_CODES.BAD_GATEWAY,
                latency,
                apiKey,
                error: 'Service not found'
            });
            return res.status(STATUS_CODES.BAD_GATEWAY).json({
                success: false,
                error: 'Service not found'
            });
        }

        // Check if service is UP
        if (service.status !== 'UP') {
            const latency = Date.now() - startTime;
            // Record metric for failed request
            metricsBuffer.recordMetric(apiKey, latency, STATUS_CODES.SERVICE_UNAVAILABLE, false, routeData._id.toString());
            createLog({
                timestamp: new Date(),
                method,
                endpoint: requestPath,
                statusCode: STATUS_CODES.SERVICE_UNAVAILABLE,
                latency,
                apiKey,
                error: 'Service unavailable'
            });

            return res.status(STATUS_CODES.SERVICE_UNAVAILABLE).json({
                success: false,
                error: 'Service unavailable'
            });
        }

        // Step 5: Proxy the request
        const targetPath = routeData.destinationPath || requestPath;
        const targetUrl = `${service.baseUrl}${targetPath}`;

        const proxyConfig = {
            method,
            url: targetUrl,
            headers: {
                ...req.headers,
                'x-forwarded-for': req.ip,
                'x-api-key': apiKey
            },
            params: req.query,
            data: req.body,
            validateStatus: () => true // Accept any status code
        };

        // Remove host header to avoid conflicts
        delete proxyConfig.headers.host;

        const proxyResponse = await axios(proxyConfig);
        const latency = Date.now() - startTime;

        // Step 6: Record metrics
        metricsBuffer.recordMetric(apiKey, latency, proxyResponse.status, false, routeData._id.toString());

        // Step 7: Create log entry
        createLog({
            timestamp: new Date(),
            method,
            endpoint: requestPath,
            statusCode: proxyResponse.status,
            latency,
            apiKey,
            userId: apiKeyData.userId
        });

        // Step 8: Update API key stats
        updateApiKeyStats(apiKeyData._id, {
            totalRequests: 1,
            blockedRequests: 0,
            averageLatency: latency
        });

        // Step 9: Return proxied response
        res.status(proxyResponse.status).json(proxyResponse.data);

    } catch (error) {
        const latency = Date.now() - startTime;
        // Use apiKey from outer scope if available, otherwise skip or use 'unknown'
        if (req.params.apiKey) {
            metricsBuffer.recordMetric(req.params.apiKey, latency, STATUS_CODES.INTERNAL_SERVER_ERROR);
        }

        // Log error
        createLog({
            timestamp: new Date(),
            method: req.method,
            endpoint: req.path,
            statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
            latency,
            apiKey: req.params.apiKey,
            error: error.message
        });

        next(error);
    }
};

module.exports = proxyHandler;
