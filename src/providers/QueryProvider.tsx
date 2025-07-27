import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on 401/403/404 errors
        if (error instanceof Error && (
          error.message.includes('401') || 
          error.message.includes('403') || 
          error.message.includes('404')
        )) {
          return false;
        }
        return failureCount < 2; // Reduce retries
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchInterval: false, // Disable automatic refetching
      refetchOnWindowFocus: false, // Disable refetch on window focus
    },
  },
});

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}