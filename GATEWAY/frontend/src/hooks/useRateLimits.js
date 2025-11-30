import { useMutation } from '@tanstack/react-query';
import { checkRateLimit } from '../api/ratelimits';

/**
 * Custom hook for Rate Limits
 */
export const useRateLimits = () => {
    // Check rate limit mutation
    const checkMutation = useMutation({
        mutationFn: checkRateLimit,
    });

    return {
        checkRateLimit: checkMutation.mutate,
        isChecking: checkMutation.isPending,
        checkError: checkMutation.error,
        checkResult: checkMutation.data?.data,
        resetCheck: checkMutation.reset,
    };
};
