// src/hooks/useApiData.js
import { useQuery } from '@tanstack/react-query';
import apiClient from '../lib/axios';

export const useApiStats = (apiKey) => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['api-stats', apiKey],
        queryFn: async () => {
            if (!apiKey) return null;
            const response = await apiClient.get(`/api/${apiKey}/stats`);
            return response.data.data;
        },
        enabled: !!apiKey,
        staleTime: 30000
    });

    return {
        stats: data || { /* default omitted for brevity */ },
        isLoading,
        error,
        refetch
    };
};

export const useApiServices = (apiKey) => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['api-services', apiKey],
        queryFn: async () => {
            if (!apiKey) return null;
            const response = await apiClient.get(`/api/${apiKey}/services`);
            return response.data.data;
        },
        enabled: !!apiKey,
        staleTime: 30000
    });

    return {
        services: data || [],
        isLoading,
        error,
        refetch
    };
};

export const useApiRoutes = (apiKey) => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['api-routes', apiKey],
        queryFn: async () => {
            if (!apiKey) return null;
            const response = await apiClient.get(`/api/${apiKey}/routes`);
            return response.data.data;
        },
        enabled: !!apiKey
    });

    return {
        routes: data || [],
        isLoading,
        error,
        refetch
    };
};

export const useApiLogs = (apiKey, filters = {}) => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['api-logs', apiKey, filters],
        queryFn: async () => {
            if (!apiKey) return null;
            const params = new URLSearchParams();
            if (filters.page) params.append('page', filters.page);
            if (filters.limit) params.append('limit', filters.limit);
            if (filters.status) params.append('status', filters.status);
            const queryString = params.toString();
            const url = `/api/${apiKey}/logs${queryString ? `?${queryString}` : ''}`;
            const response = await apiClient.get(url);
            return response.data.data;
        },
        enabled: !!apiKey,
        staleTime: 30000
    });

    return {
        logs: data?.logs || [],
        pagination: data?.pagination || { page: 1, limit: 50, total: 0, pages: 1 },
        isLoading,
        error,
        refetch
    };
};
