const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export interface UserDto {
  id: string;
  displayName: string;
  discordId: string;
  avatarUrl?: string;
  tz: string;
  role: 'USER' | 'ADMIN';
  teamId?: string;
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

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
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
      throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getMe(): Promise<UserDto> {
    return this.request<UserDto>('/api/me');
  }

  async logout(): Promise<void> {
    return this.request<void>('/auth/logout', { method: 'POST' });
  }
}

export const apiClient = new ApiClient();