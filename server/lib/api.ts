import { CreateUserRequest, ApiResponse, User, Clue, CompleteClueRequest } from './types';

// Get the base URL - in production this will be your deployed URL
const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000'; // For local development
  }
  return 'https://your-app-name.vercel.app'; // Replace with your actual Vercel URL
};

const BASE_URL = getBaseUrl();

class ApiClient {
  private baseUrl: string;
  private userId: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  getUserId(): string | null {
    return this.userId;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}/api${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      ...(this.userId && { 'x-user-id': this.userId }),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'An error occurred',
        };
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: 'Network error occurred',
      };
    }
  }

  // User endpoints
  async registerUser(userData: CreateUserRequest): Promise<ApiResponse<User>> {
    const response = await this.makeRequest<User>('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    // If registration successful, store the user ID
    if (response.success && response.data) {
      this.setUserId(response.data.id);
    }

    return response;
  }

  async getUserProfile(): Promise<ApiResponse<User>> {
    if (!this.userId) {
      return {
        success: false,
        error: 'No user ID available',
      };
    }

    return this.makeRequest<User>('/users/profile');
  }

  // Clue endpoints
  async getUserClues(): Promise<ApiResponse<Clue[]>> {
    return this.makeRequest<Clue[]>('/clues');
  }

  async getClue(clueId: string): Promise<ApiResponse<Clue>> {
    return this.makeRequest<Clue>(`/clues/${clueId}`);
  }

  async unlockClue(clueId: string, password: string): Promise<ApiResponse<any>> {
    if (!this.userId) {
      return {
        success: false,
        error: 'No user ID available',
      };
    }

    return this.makeRequest<any>(`/clues/${clueId}/unlock`, {
      method: 'POST',
      body: JSON.stringify({
        userId: this.userId,
        password,
      }),
    });
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<any>> {
    return this.makeRequest<any>('/health');
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient(BASE_URL);

// Export types for convenience
export type { CreateUserRequest, ApiResponse, User, Clue };