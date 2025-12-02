/**
 * Build proxy URL for an API key
 * @param {string} apiKey - API key
 * @param {string} path - Path to append
 * @returns {string} - Full proxy URL
 */
export const buildProxyUrl = (apiKey, path = '') => {
    const baseUrl = import.meta.env.VITE_API_URL || 'https://axiom-custom-api-gateway.onrender.com';

    // Ensure path starts with / if not empty
    const cleanPath = path && !path.startsWith('/') ? `/${path}` : path;

    // 🔥 FIX: /proxy → /gateway
    return `${baseUrl}/gateway/${apiKey}${cleanPath}`;
};

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} - Success status
 */
export const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Failed to copy:', err);
        return false;
    }
};
