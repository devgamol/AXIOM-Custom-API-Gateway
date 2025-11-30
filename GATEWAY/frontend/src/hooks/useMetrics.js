// src/hooks/useMetrics.js
import { useQuery } from '@tanstack/react-query';
import { getMetrics } from '../api/metrics';
import { useState } from 'react';

/**
 * Custom hook for Metrics
 */
export const useMetrics = (apiKey, initialRange = {}) => {
    const [dateRange, setDateRange] = useState({
        from: initialRange.from || '',
        to: initialRange.to || ''
    });

    const {
        data,
        isLoading,
        error,
        refetch
    } = useQuery({
        queryKey: ['metrics', apiKey, dateRange],
        queryFn: () => getMetrics(apiKey, dateRange),
        enabled: !!apiKey,
        staleTime: 0,
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchOnWindowFocus: false
    });

    const updateRange = (from, to) => {
        setDateRange({ from, to });
    };

    return {
        metrics: data?.data?.metrics || [],
        aggregated: data?.data?.aggregated || {
            totalRequests: 0,
            blockedRequests: 0,
            avgLatency: 0,
            statusBreakdown: { '2xx': 0, '4xx': 0, '5xx': 0 }
        },
        isLoading,
        error,
        refetch,
        dateRange,
        updateRange
    };
};
