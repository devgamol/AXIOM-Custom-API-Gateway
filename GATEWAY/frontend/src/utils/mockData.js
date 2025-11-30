// Mock API Keys
export const mockApiKeys = [
    {
        id: '1',
        name: 'Production API',
        key: 'pk_live_1234567890abcdef',
        baseUrl: 'https://api.example.com',
        status: 'Active',
        createdAt: '2024-01-15',
        totalRequests: 125430,
        avgLatency: 145,
    },
    {
        id: '2',
        name: 'Staging API',
        key: 'pk_test_abcdef1234567890',
        baseUrl: 'https://staging-api.example.com',
        status: 'Active',
        createdAt: '2024-02-20',
        totalRequests: 45230,
        avgLatency: 98,
    },
    {
        id: '3',
        name: 'Development API',
        key: 'pk_dev_9876543210fedcba',
        baseUrl: 'https://dev-api.example.com',
        status: 'Active',
        createdAt: '2024-03-10',
        totalRequests: 12450,
        avgLatency: 67,
    },
];

// Mock Services
export const mockServices = [
    {
        id: '1',
        name: 'User Service',
        baseUrl: 'https://users.example.com',
        status: 'UP',
        avgLatency: 120,
        uptime: 99.9,
    },
    {
        id: '2',
        name: 'Payment Service',
        baseUrl: 'https://payments.example.com',
        status: 'UP',
        avgLatency: 180,
        uptime: 99.5,
    },
    {
        id: '3',
        name: 'Notification Service',
        baseUrl: 'https://notifications.example.com',
        status: 'UP',
        avgLatency: 95,
        uptime: 99.8,
    },
    {
        id: '4',
        name: 'Analytics Service',
        baseUrl: 'https://analytics.example.com',
        status: 'DOWN',
        avgLatency: 0,
        uptime: 85.2,
    },
];

// Mock Routes
export const mockRoutes = [
    {
        id: '1',
        path: '/api/users',
        method: 'GET',
        targetService: 'User Service',
        destination: 'https://users.example.com/users',
        requests: 15420,
    },
    {
        id: '2',
        path: '/api/payments',
        method: 'POST',
        targetService: 'Payment Service',
        destination: 'https://payments.example.com/process',
        requests: 8930,
    },
    {
        id: '3',
        path: '/api/notifications',
        method: 'POST',
        targetService: 'Notification Service',
        destination: 'https://notifications.example.com/send',
        requests: 23450,
    },
    {
        id: '4',
        path: '/api/analytics',
        method: 'GET',
        targetService: 'Analytics Service',
        destination: 'https://analytics.example.com/data',
        requests: 5670,
    },
];

// Mock Rate Limits
export const mockRateLimits = [
    {
        id: '1',
        endpoint: '/api/users',
        limit: 100,
        window: 'per minute',
        usage: 67,
        status: 'Normal',
    },
    {
        id: '2',
        endpoint: '/api/payments',
        limit: 50,
        window: 'per minute',
        usage: 45,
        status: 'Warning',
    },
    {
        id: '3',
        endpoint: '/api/notifications',
        limit: 200,
        window: 'per minute',
        usage: 195,
        status: 'Critical',
    },
    {
        id: '4',
        endpoint: '/api/analytics',
        limit: 150,
        window: 'per minute',
        usage: 34,
        status: 'Normal',
    },
];

// Mock Logs
export const mockLogs = [
    {
        id: '1',
        timestamp: new Date(Date.now() - 1000 * 60),
        method: 'GET',
        endpoint: '/api/users',
        status: 200,
        latency: 145,
        ip: '192.168.1.100',
    },
    {
        id: '2',
        timestamp: new Date(Date.now() - 1000 * 120),
        method: 'POST',
        endpoint: '/api/payments',
        status: 201,
        latency: 234,
        ip: '192.168.1.101',
    },
    {
        id: '3',
        timestamp: new Date(Date.now() - 1000 * 180),
        method: 'GET',
        endpoint: '/api/users',
        status: 200,
        latency: 98,
        ip: '192.168.1.102',
    },
    {
        id: '4',
        timestamp: new Date(Date.now() - 1000 * 240),
        method: 'POST',
        endpoint: '/api/notifications',
        status: 200,
        latency: 67,
        ip: '192.168.1.103',
    },
    {
        id: '5',
        timestamp: new Date(Date.now() - 1000 * 300),
        method: 'GET',
        endpoint: '/api/analytics',
        status: 500,
        latency: 0,
        ip: '192.168.1.104',
    },
];

// Mock Metrics Data
export const mockMetrics = {
    totalRequests: 183130,
    blockedRequests: 2340,
    activeServices: 3,
    avgLatency: 127,
};

// Mock Chart Data - Requests over time
export const mockChartData = [
    { time: '00:00', requests: 1200, blocked: 45 },
    { time: '04:00', requests: 800, blocked: 20 },
    { time: '08:00', requests: 3400, blocked: 120 },
    { time: '12:00', requests: 5600, blocked: 200 },
    { time: '16:00', requests: 4200, blocked: 150 },
    { time: '20:00', requests: 2800, blocked: 80 },
];

// Mock Usage Chart Data
export const mockUsageData = [
    { endpoint: '/api/users', usage: 67, limit: 100 },
    { endpoint: '/api/payments', usage: 45, limit: 50 },
    { endpoint: '/api/notifications', usage: 195, limit: 200 },
    { endpoint: '/api/analytics', usage: 34, limit: 150 },
];
