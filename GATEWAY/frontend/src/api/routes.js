import apiClient from '../lib/axios';

// Base URL for routes
const ROUTES_BASE = '/routes';

/**
 * Create a new route
 * @param {Object} data - { path, method, serviceId, destinationPath, rateLimit }
 * @returns {Promise} - { success, data: route }
 */
export const createRoute = async (data) => {
    const response = await apiClient.post(ROUTES_BASE, data);
    return response.data;
};

/**
 * Get all routes
 * @returns {Promise} - { success, data: [routes] }
 */
export const getRoutes = async () => {
    const response = await apiClient.get(ROUTES_BASE);
    return response.data;
};

/**
 * Lookup a route by path and method
 * @param {string} path - Route path
 * @param {string} method - HTTP method (GET, POST, etc.)
 * @returns {Promise} - { success, data: route }
 */
export const lookupRoute = async (path, method) => {
    const response = await apiClient.get(`${ROUTES_BASE}/lookup`, {
        params: { path, method }
    });
    return response.data;
};

/**
 * Update a route
 * @param {string} id - Route ID
 * @param {Object} data - { path, method, serviceId, destinationPath, rateLimit, isActive }
 * @returns {Promise} - { success, data: route }
 */
export const updateRoute = async (id, data) => {
    const response = await apiClient.put(`${ROUTES_BASE}/${id}`, data);
    return response.data;
};

/**
 * Delete a route
 * @param {string} id - Route ID
 * @returns {Promise} - { success, message }
 */
export const deleteRoute = async (id) => {
    const response = await apiClient.delete(`${ROUTES_BASE}/${id}`);
    return response.data;
};
