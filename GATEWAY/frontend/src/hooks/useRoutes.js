import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../lib/axios';

const ROUTES_BASE = '/routes';

export const useRoutes = (apiKey) => {
    const queryClient = useQueryClient();

    /** CREATE ROUTE */
    const createRouteMutation = useMutation({
        mutationFn: (data) => apiClient.post(ROUTES_BASE, data),
        onSuccess: () => {
            // Invalidate route-related queries
            queryClient.invalidateQueries({ queryKey: ['api-routes'] });
            queryClient.invalidateQueries({ queryKey: ['api-routes', apiKey] });
        }
    });

    /** DELETE ROUTE */
    const deleteRouteMutation = useMutation({
        mutationFn: (routeId) => apiClient.delete(`${ROUTES_BASE}/${routeId}`),
        onSuccess: () => {
            // IMPORTANT: Refresh all places that use route data
            queryClient.invalidateQueries({ queryKey: ['api-routes'] });
            queryClient.invalidateQueries({ queryKey: ['api-routes', apiKey] });
        }
    });

    return {
        createRoute: createRouteMutation.mutate,
        deleteRoute: deleteRouteMutation.mutate,
    };
};
