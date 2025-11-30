import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getServices,
    getService,
    createService,
    updateService,
    deleteService
} from '../api/services';

/**
 * Custom hook for Services management
 */
export const useServices = (serviceId = null) => {
    const queryClient = useQueryClient();

    // Fetch all services
    const {
        data: servicesData,
        isLoading: isLoadingServices,
        error: servicesError,
        refetch: refetchServices
    } = useQuery({
        queryKey: ['services'],
        queryFn: getServices,
    });

    // Fetch single service (if ID provided)
    const {
        data: serviceData,
        isLoading: isLoadingService,
        error: serviceError
    } = useQuery({
        queryKey: ['service', serviceId],
        queryFn: () => getService(serviceId),
        enabled: !!serviceId,
    });

    // Create service mutation
    const createMutation = useMutation({
        mutationFn: createService,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['services'] });
            queryClient.invalidateQueries({ queryKey: ['all-services'] });
        },
    });

    // Update service mutation
    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => updateService(id, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['services'] });
            queryClient.invalidateQueries({ queryKey: ['all-services'] });
            queryClient.invalidateQueries({ queryKey: ['service', variables.id] });
        },
    });

    // Delete service mutation
    const deleteMutation = useMutation({
        mutationFn: deleteService,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['all-services'] });
            queryClient.invalidateQueries({ queryKey: ['services'] });
        },
    });


    return {
        // List data
        services: servicesData?.data || [],
        isLoadingServices,
        servicesError,
        refetchServices,

        // Single service data
        service: serviceData?.data,
        isLoadingService,
        serviceError,

        // Actions
        createService: createMutation.mutate,
        updateService: updateMutation.mutate,
        deleteService: deleteMutation.mutate,

        // Action states
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,

        // Action errors
        createError: createMutation.error,
        updateError: updateMutation.error,
        deleteError: deleteMutation.error,
    };
};
