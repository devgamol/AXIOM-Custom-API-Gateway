// src/hooks/useApiKeys.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getApiKeys,
    createApiKey,
    rotateApiKey,
    deleteApiKey,
    validateApiKey
} from '../api/apikeys';
import { useAuth } from '../context/AuthContext';

/**
 * Custom hook for API keys management
 */
export const useApiKeys = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const userId = user?.id || user?._id || null;

    // Fetch all API keys for current user
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['apiKeys', userId],
        queryFn: () => getApiKeys(userId),
        enabled: !!userId, // Only run if logged in
        staleTime: 30000
    });

    const createMutation = useMutation({
        mutationFn: createApiKey,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['apiKeys', userId] });
        },
    });

    const rotateMutation = useMutation({
        mutationFn: rotateApiKey,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['apiKeys', userId] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteApiKey,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['apiKeys', userId] });
        },
    });

    const validateMutation = useMutation({
        mutationFn: validateApiKey,
    });

    return {
        apiKeys: data?.data || [],
        isLoading,
        error,
        refetch,
        createApiKey: createMutation.mutate,
        rotateApiKey: rotateMutation.mutate,
        deleteApiKey: deleteMutation.mutate,
        validateApiKey: validateMutation.mutate,
        isCreating: createMutation.isPending,
        isRotating: rotateMutation.isPending,
        isDeleting: deleteMutation.isPending,
        isValidating: validateMutation.isPending,
        createError: createMutation.error,
        rotateError: rotateMutation.error,
        deleteError: deleteMutation.error,
        validateError: validateMutation.error,
        validateResult: validateMutation.data,
    };
};
