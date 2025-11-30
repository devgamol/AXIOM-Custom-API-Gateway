import apiClient from '../lib/axios';

// Base URL for rate limit service
const RATE_LIMIT_BASE = '/ratelimit';

/**
 * Check if a request is within rate limit
 * @param {Object} data - { apiKey, routeId, limit }
 * @returns {Promise} - { success, data: { allowed, remaining, resetAt } }
 */
export const checkRateLimit = async (data) => {
    const response = await apiClient.post(`${RATE_LIMIT_BASE}/check`, data);
    return response.data;
};
