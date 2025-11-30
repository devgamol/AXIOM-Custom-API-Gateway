import toast from 'react-hot-toast';

/**
 * Copy text to clipboard with toast notification
 * @param {string} text - Text to copy
 * @param {string} successMessage - Success message to display
 * @returns {Promise<boolean>} - Success status
 */
export const copyToClipboard = async (text, successMessage = 'Copied to clipboard!') => {
    try {
        await navigator.clipboard.writeText(text);
        toast.success(successMessage, {
            duration: 2000,
            position: 'bottom-right',
            style: {
                background: '#10B981',
                color: '#fff',
            },
            iconTheme: {
                primary: '#fff',
                secondary: '#10B981',
            },
        });
        return true;
    } catch (error) {
        console.error('Failed to copy:', error);
        toast.error('Failed to copy to clipboard', {
            duration: 2000,
            position: 'bottom-right',
        });
        return false;
    }
};

/**
 * Show success toast
 */
export const showSuccess = (message) => {
    toast.success(message, {
        duration: 3000,
        position: 'bottom-right',
    });
};

/**
 * Show error toast
 */
export const showError = (message) => {
    toast.error(message, {
        duration: 4000,
        position: 'bottom-right',
    });
};

/**
 * Show loading toast
 */
export const showLoading = (message) => {
    return toast.loading(message, {
        position: 'bottom-right',
    });
};

/**
 * Dismiss toast by ID
 */
export const dismissToast = (toastId) => {
    toast.dismiss(toastId);
};
