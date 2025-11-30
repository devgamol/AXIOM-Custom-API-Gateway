// src/hooks/useDashboardStats.js
import { useQuery } from '@tanstack/react-query';
import apiClient from '../lib/axios';

/**
 * Custom hook for fetching comprehensive dashboard statistics
 */
export const useDashboardStats = () => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: async () => {
            const response = await apiClient.get('/dashboard/stats');
            return response.data;
        },
        staleTime: 0,
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchOnWindowFocus: false
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
            proxyUrl: 'http://localhost:5000/proxy/{your-api-key}'
        },
        isLoading,
        error,
        refetch
    };
};
