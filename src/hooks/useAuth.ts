import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { config } from '@/lib/config';

export function useAuthStatus() {
  return useQuery({
    queryKey: ['auth-status'],
    queryFn: () => apiClient.checkAuthStatus(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

export function useMe() {
  const { data: authStatus } = useAuthStatus();
  
  return useQuery({
    queryKey: ['me'],
    queryFn: () => apiClient.getMe(),
    enabled: authStatus?.authenticated === true,
    retry: false,
  });
}

export function useAuth() {
  const queryClient = useQueryClient();
  const { data: authStatus, isLoading: authLoading, error: authError } = useAuthStatus();
  const { data: user, isLoading: userLoading, error } = useMe();

  // If auth status request fails (CORS/403), don't consider user authenticated
  const isAuthenticated = !authError && authStatus?.authenticated === true && !!user;
  const isLoading = authLoading || (authStatus?.authenticated === true && userLoading);
  const isUnauthenticated = !authLoading && (authError || authStatus?.authenticated === false);

  const login = () => {
    window.location.href = `${config.API_BASE_URL}/oauth2/authorization/discord`;
  };

  const logout = async () => {
    try {
      await apiClient.logout();
      queryClient.setQueryData(['auth-status'], { authenticated: false });
      queryClient.setQueryData(['me'], null);
      queryClient.clear();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    isUnauthenticated,
    login,
    logout,
  };
}