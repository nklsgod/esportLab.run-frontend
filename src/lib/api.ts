import { config } from './config';
import { getAuthToken, removeAuthToken } from './auth';

const API_BASE_URL = config.API_BASE_URL;

export interface UserDto {
  id: string;
  discordUserId: string;
  displayName: string;
  avatarUrl?: string;
  tz: string;
  roles: string[];
  teamIds: string[];
  hasTeam?: boolean;
  isTeamOwner?: boolean;
  isTeamAdmin?: boolean;
}

export interface ProblemDetail {
  title: string;
  detail: string;
  status: number;
  type?: string;
  instance?: string;
  traceId?: string;
}

class ApiError extends Error {
  public problemDetail: ProblemDetail;
  
  constructor(problemDetail: ProblemDetail) {
    super(problemDetail.detail);
    this.name = 'ApiError';
    this.problemDetail = problemDetail;
  }
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = getAuthToken();
    
    const config: RequestInit = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        // Handle token expiration
        if (response.status === 401) {
          removeAuthToken();
          window.location.href = '/login';
          throw new Error('Unauthorized - redirecting to login');
        }

        // Log CORS/403 errors for debugging
        if (response.status === 403) {
          console.error('CORS/403 Error - Check CORS_ALLOWED_ORIGINS on Railway:', {
            url,
            status: response.status,
            statusText: response.statusText,
          });
        }

        if (response.headers.get('content-type')?.includes('application/problem+json')) {
          const problemDetail: ProblemDetail = await response.json();
          throw new ApiError(problemDetail);
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return undefined as T;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Specific error handling for network issues
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          throw new Error('Network error: Unable to connect to server. Check CORS configuration.');
        }
        throw new Error(`Network error: ${error.message}`);
      }
      
      throw new Error('Unknown network error');
    }
  }

  async getMe(): Promise<UserDto> {
    return this.request<UserDto>('/api/me');
  }

  async checkAuthStatus(): Promise<{ authenticated: boolean }> {
    return this.request<{ authenticated: boolean }>('/auth/status');
  }

  async logout(): Promise<void> {
    return this.request<void>('/auth/logout', { method: 'POST' });
  }
}

export const apiClient = new ApiClient();