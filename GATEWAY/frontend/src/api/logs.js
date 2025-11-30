import apiClient from '../lib/axios';

// Base URL for logs service
const LOGS_BASE = '/logs';

/**
 * Create a log entry (used internally by gateway)
 * @param {Object} data - Log data
 * @returns {Promise} - { success, data: log }
 */
export const createLog = async (data) => {
    const response = await apiClient.post(LOGS_BASE, data);
    return response.data;
};

/**
 * Get logs with optional filters and pagination
 */
export const getLogs = async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.apiKey) params.append('apiKey', filters.apiKey);
    if (filters.status) params.append('status', filters.status);
    if (filters.from) params.append('from', filters.from);
    if (filters.to) params.append('to', filters.to);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

    const queryString = params.toString();
    const url = queryString ? `/logs?${queryString}` : '/logs';

    const response = await apiClient.get(url);
    return response.data;
};
