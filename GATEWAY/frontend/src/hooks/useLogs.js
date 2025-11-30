import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getLogs } from '../api/logs';
import { useState } from 'react';

/**
 * Custom hook for Logs viewing with filters and pagination
 */
export const useLogs = () => {
    const queryClient = useQueryClient();
    const [filters, setFilters] = useState({ apiKey: '', status: '' });
    const [page, setPageNumber] = useState(1);

    // Fetch logs with filters and pagination
    const { data, isLoading, error } = useQuery({
        queryKey: ['logs', filters, page],
        queryFn: () => getLogs({ ...filters, page, limit: 50 }),
        staleTime: 30000
    });

    const updateFilter = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPageNumber(1); // Reset to page 1 when filter changes
    };

    const setPage = (newPage) => {
        setPageNumber(newPage);
    };

    return {
        logs: data?.data?.logs || data?.data || [],
        pagination: data?.data?.pagination || { page: 1, limit: 50, total: 0, pages: 1 },
        isLoading,
        error,
        filters,
        updateFilter,
        setPage
    };
};
