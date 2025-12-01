import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getServices,
    getService,
    createService,
    updateService,
    deleteService
} from '../api/services';
import { useApi } from '../context/ApiContext';

export const useServices = (serviceId = null) => {
    const queryClient = useQueryClient();
    const { selectedApi } = useApi();   // ⭐ GET THE SELECTED API
    const apiKey = selectedApi?.key;    // ⭐ EXACT API KEY THE USER SELECTED

    // -----------------------------
    // GET ALL SERVICES FOR THIS API KEY
    // -----------------------------
    const {
        data: servicesData,
        isLoading: isLoadingServices,
        error: servicesError,
        refetch: refetchServices
    } = useQuery({
        queryKey: ['services', apiKey],
        queryFn: () => getServices(apiKey),   // ⭐ PASS apiKey to backend
        enabled: !!apiKey,                   // ⭐ Wait until apiKey exists
    });

    // -----------------------------
    // GET ONE SERVICE
    // -----------------------------
    const {
        data: serviceData,
        isLoading: isLoadingService,
        error: serviceError
    } = useQuery({
        queryKey: ['service', serviceId],
        queryFn: () => getService(serviceId),
        enabled: !!serviceId,
    });

    // -----------------------------
    // CREATE
    // -----------------------------
    const createMutation = useMutation({
        mutationFn: (data) => createService({ ...data, apiKey }), // ⭐ attach apiKey
        onSuccess: () => {
            queryClient.invalidateQueries(['services', apiKey]);
        },
    });

    // UPDATE
    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => updateService(id, data),
        onSuccess: (_, vars) => {
            queryClient.invalidateQueries(['services', apiKey]);
            queryClient.invalidateQueries(['service', vars.id]);
        },
    });

    // DELETE
    const deleteMutation = useMutation({
        mutationFn: deleteService,
        onSuccess: () => {
            queryClient.invalidateQueries(['services', apiKey]);
        },
    });

    return {
        services: servicesData?.data || [],
        isLoadingServices,
        servicesError,
        refetchServices,

        service: serviceData?.data,
        isLoadingService,
        serviceError,

        createService: createMutation.mutate,
        updateService: updateMutation.mutate,
        deleteService: deleteMutation.mutate,

        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
};
