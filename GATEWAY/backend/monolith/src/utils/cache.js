const NodeCache = require('node-cache');
const { DEFAULTS } = require('../shared/constants');

// Create cache instances with different TTLs
const routeCache = new NodeCache({
    stdTTL: DEFAULTS.CACHE_TTL.ROUTE,
    checkperiod: 10
});

const serviceCache = new NodeCache({
    stdTTL: DEFAULTS.CACHE_TTL.SERVICE,
    checkperiod: 10
});

const apiKeyCache = new NodeCache({
    stdTTL: DEFAULTS.CACHE_TTL.API_KEY,
    checkperiod: 15
});

module.exports = {
    routeCache,
    serviceCache,
    apiKeyCache
};
