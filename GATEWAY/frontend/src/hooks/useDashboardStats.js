import { useQuery } from '@tanstack/react-query';
import apiClient from '../lib/axios';

/**
 * Custom hook for fetching comprehensive dashboard statistics
 * Auto-refreshes every 5 seconds
 */
export const useDashboardStats = () => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: async () => {
            const response = await apiClient.get('/dashboard/stats');
            return response.data;
        },
        staleTime: 30000
    });

    return {
        stats: data || {
            totalRequests: 0,
            blockedRequests: 0,
            activeServices: 0,
            activeApiKeys: 0,
            averageLatency: 0,
            successRate: 100,
            statusBreakdown: { '2xx': 0, '4xx': 0, '5xx': 0 },
            recent: [],
            timeseries: [],
             proxyUrl: `${import.meta.env.VITE_API_BASE}/proxy/{your-api-key}`
        },
        isLoading,
        error,
        refetch
    };
};
