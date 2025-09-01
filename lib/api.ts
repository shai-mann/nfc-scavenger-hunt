import AsyncStorage from '@react-native-async-storage/async-storage';

// API Configuration
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api' 
  : 'https://your-production-url.com/api';

const STORAGE_KEYS = {
  USER_DATA: 'userData',
} as const;

// Types matching server API
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface ApiError {
  success: false;
  error: string;
  message?: string;
}

export interface User {
  id: string;
  username: string;
  created_at: string;
}

export interface CreateUserRequest {
  username: string;
}

export interface Clue {
  id: string;
  title: string;
  description: string;
  location_hint: string;
  is_unlocked: boolean;
  unlocked_at?: string;
}

export interface CompleteClueRequest {
  userId: string;
  password: string;
}

// Storage utilities
export const storage = {
  async setUserData(user: User): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
  },

  async getUserData(): Promise<User | null> {
    const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  },

  async clearUserData(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
  },
};

// HTTP utilities
class ApiClient {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network request failed');
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.makeRequest<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.makeRequest<T>(endpoint, { method: 'DELETE' });
  }
}

const apiClient = new ApiClient();

// API service methods
export const api = {
  // User endpoints
  users: {
    async register(userData: CreateUserRequest): Promise<ApiResponse<User>> {
      const response = await apiClient.post<ApiResponse<User>>('/users/register', userData);
      
      // Store user data if registration is successful
      if (response.success) {
        await storage.setUserData(response.data);
      }
      
      return response;
    },

    async getProfile(userId: string): Promise<ApiResponse<User>> {
      return apiClient.get<ApiResponse<User>>(`/users/profile?userId=${userId}`);
    },
  },

  // Clue endpoints (all require userId parameter)
  clues: {
    async getUserClues(userId: string): Promise<ApiResponse<Clue[]>> {
      return apiClient.get<ApiResponse<Clue[]>>(`/clues?userId=${userId}`);
    },

    async getClue(clueId: string, userId: string): Promise<ApiResponse<Clue>> {
      return apiClient.get<ApiResponse<Clue>>(`/clues/${clueId}?userId=${userId}`);
    },

    async unlockClue(clueId: string, data: CompleteClueRequest): Promise<ApiResponse<Clue>> {
      return apiClient.post<ApiResponse<Clue>>(`/clues/${clueId}/unlock`, data);
    },
  },

  // Utility methods
  async checkHealth(): Promise<{ status: string; message: string; timestamp: string; version: string }> {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
    return response.json();
  },
};

// Authentication utilities (simplified since no JWT)
export const auth = {
  async isLoggedIn(): Promise<boolean> {
    const userData = await storage.getUserData();
    return !!userData;
  },

  async getCurrentUser(): Promise<User | null> {
    return await storage.getUserData();
  },

  async logout(): Promise<void> {
    await storage.clearUserData();
  },
};