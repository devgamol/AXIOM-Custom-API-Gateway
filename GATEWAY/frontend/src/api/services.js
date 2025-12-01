import apiClient from '../lib/axios';

// Base URL for services
const SERVICES_BASE = '/services';

/**
 * Create a new backend service
 * @param {Object} data - { name, baseUrl, description, status }
 * @returns {Promise} - { success, data: service }
 */
export const createService = async (data) => {
    const response = await apiClient.post(SERVICES_BASE, data);
    return response.data;
};

/**
 * Get all services
 * @returns {Promise} - { success, data: [services] }
 */
export const getServices = async (apiKey) => {
    const response = await apiClient.get('/services', {
        params: { apiKey }   // ⭐ add filter
    });
    return response.data;
};


/**
 * Get a specific service by ID
 * @param {string} id - Service ID
 * @returns {Promise} - { success, data: service }
 */
export const getService = async (id) => {
    const response = await apiClient.get(`${SERVICES_BASE}/${id}`);
    return response.data;
};

/**
 * Update a service
 * @param {string} id - Service ID
 * @param {Object} data - { name, baseUrl, status, avgLatency, description }
 * @returns {Promise} - { success, data: service }
 */
export const updateService = async (id, data) => {
    const response = await apiClient.put(`${SERVICES_BASE}/${id}`, data);
    return response.data;
};

/**
 * Delete a service
 * @param {string} id - Service ID
 * @returns {Promise} - { success, message }
 */
export const deleteService = async (id) => {
    const token = localStorage.getItem("auth_token");

    const response = await apiClient.delete(`${SERVICES_BASE}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    return response.data;   // IMPORTANT: return parsed data
};
