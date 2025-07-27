import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

export function useAuthStatus() {
  return useQuery({
    queryKey: ['auth-status'],
    queryFn: () => apiClient.checkAuthStatus(),
    retry: false,
    staleTime: 30000, // 30 seconds
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
  const { data: authStatus, isLoading: authLoading } = useAuthStatus();
  const { data: user, isLoading: userLoading, error } = useMe();

  const isAuthenticated = authStatus?.authenticated === true && !!user;
  const isLoading = authLoading || (authStatus?.authenticated === true && userLoading);
  const isUnauthenticated = !authLoading && authStatus?.authenticated === false;

  const login = () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
    window.location.href = `${API_BASE_URL}/oauth2/authorization/discord`;
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