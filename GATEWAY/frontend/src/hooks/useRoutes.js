import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../lib/axios';
import { useApi } from '../context/ApiContext';

const ROUTES_BASE = '/routes';

export const useRoutes = () => {
    const queryClient = useQueryClient();
    const { selectedApi } = useApi();
    const apiKey = selectedApi?.key;

    const createRouteMutation = useMutation({
        mutationFn: (data) => apiClient.post(ROUTES_BASE, { ...data, apiKey }),
        onSuccess: () => {
            queryClient.invalidateQueries(['api-routes', apiKey]);
        }
    });

    const deleteRouteMutation = useMutation({
        mutationFn: (routeId) => apiClient.delete(`${ROUTES_BASE}/${routeId}`),
        onSuccess: () => {
            queryClient.invalidateQueries(['api-routes', apiKey]);
        }
    });

    return {
        createRoute: createRouteMutation.mutate,
        deleteRoute: deleteRouteMutation.mutate
    };
};
