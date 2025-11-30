import { QueryClient } from '@tanstack/react-query';

// Create a client with default options
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Don't auto-refresh (manual refresh only)
            refetchOnWindowFocus: false,
            // Retry failed requests 1 time
            retry: 1,
            // Keep data fresh for 30 seconds
            staleTime: 30000,
            // Cache data for 5 minutes
            cacheTime: 5 * 60 * 1000,
        },
        mutations: {
            // Retry failed mutations 0 times
            retry: 0,
        },
    },
});
