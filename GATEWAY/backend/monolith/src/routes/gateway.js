const express = require('express');
const router = express.Router();
const proxyHandler = require('../middleware/proxyHandler');

module.exports = (metricsBuffer) => {
    // Proxy all requests with API key
    router.all('/:apiKey/*', proxyHandler(metricsBuffer));
    return router;
};
