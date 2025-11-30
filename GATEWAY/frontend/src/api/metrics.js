import apiClient from '../lib/axios';

// Base URL for metrics service
const METRICS_BASE = '/metrics';

/**
 * Create a metrics entry (used internally by gateway)
 * @param {Object} data - Metrics data
 * @returns {Promise} - { success, data: metric }
 */
export const createMetric = async (data) => {
    const response = await apiClient.post(METRICS_BASE, data);
    return response.data;
};

/**
 * Get metrics for an API key
 * @param {string} apiKey - API key
 * @param {Object} params - { from, to } - Optional date range
 * @returns {Promise} - { success, data: { metrics, aggregated } }
 */
export const getMetrics = async (apiKey, params = {}) => {
    const response = await apiClient.get(`${METRICS_BASE}/${apiKey}`, { params });
    return response.data;
};
