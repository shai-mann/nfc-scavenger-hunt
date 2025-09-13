import { API_CONFIG } from "@/config/api";
import {
  ApiResponse,
  Clue,
  ClueMetadata,
  CreateUserRequest,
  HealthCheckResponse,
  User,
} from "@/types/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_ID_KEY = "@user_id";

class ApiClient {
  private baseUrl: string;
  private userId: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.loadUserId();
  }

  private async loadUserId() {
    try {
      const storedUserId = await AsyncStorage.getItem(USER_ID_KEY);
      if (storedUserId) {
        this.userId = storedUserId;
      }
    } catch (error) {
      console.error("Error loading user ID:", error);
    }
  }

  async setUserId(userId: string) {
    this.userId = userId;
    await AsyncStorage.setItem(USER_ID_KEY, userId);
  }

  getUserId(): string | null {
    return this.userId;
  }

  async clearUserId() {
    this.userId = null;
    try {
      await AsyncStorage.removeItem(USER_ID_KEY);
    } catch (error) {
      console.error("Error clearing user ID:", error);
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}/api${endpoint}`;

    const headers = {
      "Content-Type": "application/json",
      ...(this.userId && { "x-user-id": this.userId }),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const rawData = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: rawData.error || "An error occurred",
          status: response.status,
        };
      }

      return { data: rawData.data, status: response.status, success: true };
    } catch (error) {
      console.error("API request failed:", error);
      return {
        success: false,
        error: "Network error occurred",
        status: 500,
      };
    }
  }

  // User endpoints
  async registerUser(userData: CreateUserRequest): Promise<ApiResponse<User>> {
    const response = await this.makeRequest<User>("/users/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });

    // If registration successful, store the user ID
    if (response.success && response.data) {
      try {
        await this.setUserId(response.data.id);
      } catch (error) {
        console.error("Error storing user ID:", error);
        return {
          success: false,
          error: "Failed to register user",
          status: 500,
        };
      }
    }

    return response;
  }

  async getUserProfile(): Promise<ApiResponse<User>> {
    if (!this.userId) {
      return {
        success: false,
        error: "No user ID available",
        status: 401,
      };
    }

    return this.makeRequest<User>("/users/profile");
  }

  async updateUserProfile(
    user: Partial<Omit<User, "id" | "created_at">>
  ): Promise<ApiResponse<User>> {
    if (!this.userId) {
      return {
        success: false,
        error: "No user ID available",
        status: 401,
      };
    }

    return this.makeRequest<User>("/users/profile", {
      method: "PATCH",
      body: JSON.stringify(user),
    });
  }

  // Clue endpoints
  async getUserClues(): Promise<ApiResponse<ClueMetadata[]>> {
    if (!this.userId) {
      return {
        success: false,
        error: "No user ID available",
        status: 401,
      };
    }
    return this.makeRequest<ClueMetadata[]>("/clues");
  }

  async getClue(clueId: string): Promise<ApiResponse<Clue>> {
    if (!this.userId) {
      return {
        success: false,
        error: "No user ID available",
        status: 401,
      };
    }
    return this.makeRequest<Clue>(`/clues/${clueId}`);
  }

  async unlockClue(
    clueId: string,
    password: string
  ): Promise<ApiResponse<Clue>> {
    if (!this.userId) {
      return {
        success: false,
        error: "No user ID available",
        status: 401,
      };
    }

    const response = await this.makeRequest<Clue>(`/clues/${clueId}/unlock`, {
      method: "POST",
      body: JSON.stringify({
        userId: this.userId,
        password,
      }),
    });

    return {
      success: true,
      status: response.status,
      data: response.data,
    };
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<HealthCheckResponse>> {
    return this.makeRequest<HealthCheckResponse>("/health");
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient(API_CONFIG.baseUrl);
