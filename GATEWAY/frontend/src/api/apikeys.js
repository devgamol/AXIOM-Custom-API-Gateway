import apiClient from '../lib/axios';

// Base URL for API key service
const API_KEY_BASE = '/apikeys';

/**
 * Create a new API key
 * @param {Object} data - { userId, name }
 * @returns {Promise} - { success, data: apiKey }
 */
export const createApiKey = async (data) => {
    const response = await apiClient.post(API_KEY_BASE, data);
    return response.data;
};

/**
 * Get all API keys for a user
 * @param {string} userId - User ID
 * @returns {Promise} - { success, data: [apiKeys] }
 */
export const getApiKeys = async (userId) => {
    console.log('[DEBUG] API: getApiKeys called with userId:', userId);
    const response = await apiClient.get(`${API_KEY_BASE}/${userId}`);
    console.log('[DEBUG] API: getApiKeys response:', response.data);
    return response.data;
};

/**
 * Validate an API key
 * @param {string} apiKey - API key to validate
 * @returns {Promise} - { success, data: { valid, apiKey } }
 */
export const validateApiKey = async (apiKey) => {
    const response = await apiClient.get(`${API_KEY_BASE}/validate/${apiKey}`);
    return response.data;
};

/**
 * Rotate an API key (generate new key)
 * @param {string} id - API key ID
 * @returns {Promise} - { success, data: apiKey }
 */
export const rotateApiKey = async (id) => {
    const response = await apiClient.put(`${API_KEY_BASE}/${id}/rotate`);
    return response.data;
};

/**
 * Update API key statistics
 * @param {string} id - API key ID
 * @param {Object} stats - { totalRequests, blockedRequests, averageLatency }
 * @returns {Promise} - { success, data: apiKey }
 */
export const updateApiKeyStats = async (id, stats) => {
    const response = await apiClient.patch(`${API_KEY_BASE}/${id}/stats`, stats);
    return response.data;
};

/**
 * Delete an API key
 * @param {string} id - API key ID
 * @returns {Promise} - { success, message }
 */
export const deleteApiKey = async (id) => {
    const response = await apiClient.delete(`${API_KEY_BASE}/${id}`);
    return response.data;
};
