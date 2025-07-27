import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: () => apiClient.getMe(),
    retry: false, // Don't retry auth failures
  });
}

export function useAuth() {
  const queryClient = useQueryClient();
  const { data: user, isLoading, error } = useMe();

  const logout = async () => {
    try {
      await apiClient.logout();
      queryClient.setQueryData(['me'], null);
      queryClient.clear();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isAuthenticated = !!user;
  const isUnauthenticated = !isLoading && !user;

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    isUnauthenticated,
    logout,
  };
}