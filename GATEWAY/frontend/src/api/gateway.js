import apiClient from '../lib/axios';

/**
 * Make a proxied request through the API Gateway
 * @param {string} apiKey - API key for authentication
 * @param {string} path - Path to proxy (e.g., '/posts')
 * @param {string} method - HTTP method (GET, POST, etc.)
 * @param {Object} data - Request body (for POST, PUT, PATCH)
 * @param {Object} params - Query parameters
 * @returns {Promise} - Proxied response
 */
export const proxyRequest = async (apiKey, path, method = 'GET', data = null, params = {}) => {
    // 🔥 FIX: /proxy → /gateway
    const url = `/gateway/${apiKey}${path}`;

    const config = {
        method,
        url,
        params,
    };

    if (data && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
        config.data = data;
    }

    const response = await apiClient(config);
    return response;
};

/**
 * Test a proxy endpoint
 * @param {string} apiKey - API key
 * @param {string} path - Path to test
 * @returns {Promise} - Test result
 */
export const testProxyEndpoint = async (apiKey, path) => {
    return proxyRequest(apiKey, path, 'GET');
};
