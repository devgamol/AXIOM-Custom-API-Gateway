import toast from 'react-hot-toast';

// Copy to clipboard with toast notification
export const copyToClipboard = (text, message = 'Copied to clipboard!') => {
    navigator.clipboard.writeText(text).then(() => {
        toast.success(message, {
            style: {
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
            },
            iconTheme: {
                primary: '#00FFFF',
                secondary: '#0a0e17',
            },
        });
    }).catch(() => {
        toast.error('Failed to copy');
    });
};

// Format large numbers
export const formatNumber = (num) => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
};

// Format latency
export const formatLatency = (ms) => {
    if (ms >= 1000) {
        return (ms / 1000).toFixed(2) + 's';
    }
    return ms + 'ms';
};

// Format date
export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

// Format time
export const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
};

// Format datetime
export const formatDateTime = (date) => {
    return new Date(date).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

// Generate random ID
export const generateId = () => {
    return Math.random().toString(36).substring(2, 15);
};

// Truncate text
export const truncate = (text, length = 50) => {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
};

// Mask API key
export const maskApiKey = (key) => {
    if (key.length <= 8) return key;
    return '••••' + key.slice(-4);
};
