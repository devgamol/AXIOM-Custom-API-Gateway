/**
 * Format latency in milliseconds
 * @param {number} ms - Latency in ms
 * @returns {string} - Formatted string (e.g., "120ms")
 */
export const formatLatency = (ms) => {
    if (ms === undefined || ms === null) return '-';
    return `${Math.round(ms)}ms`;
};

/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @returns {string} - Formatted date string
 */
export const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleString();
};

/**
 * Mask API key for display
 * @param {string} key - Full API key
 * @returns {string} - Masked key (e.g., "a1b2...9z")
 */
export const maskApiKey = (key) => {
    if (!key || key.length < 8) return key;
    return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
};

/**
 * Format status code with color class
 * @param {number} status - HTTP status code
 * @returns {Object} - { label, colorClass }
 */
export const formatStatus = (status) => {
    if (status >= 200 && status < 300) {
        return { label: status, color: 'text-green-500' };
    }
    if (status >= 400 && status < 500) {
        return { label: status, color: 'text-yellow-500' };
    }
    if (status >= 500) {
        return { label: status, color: 'text-red-500' };
    }
    return { label: status, color: 'text-gray-500' };
};
