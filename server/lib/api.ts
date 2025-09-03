import { NextRequest, NextResponse } from "next/server";
import { ZodError, ZodSchema } from "zod";
import { supabase } from "./supabase";
import { ApiResponse, Clue, CreateUserRequest, User } from "./types";

// Get the base URL - in production this will be your deployed URL
const getBaseUrl = () => {
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000"; // For local development
  }
  return "https://your-app-name.vercel.app"; // Replace with your actual Vercel URL
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
      "Content-Type": "application/json",
      ...(this.userId && { "x-user-id": this.userId }),
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
          error: data.error || "An error occurred",
        };
      }

      return data;
    } catch (error) {
      console.error("API request failed:", error);
      return {
        success: false,
        error: "Network error occurred",
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
      this.setUserId(response.data.id);
    }

    return response;
  }

  async getUserProfile(): Promise<ApiResponse<User>> {
    if (!this.userId) {
      return {
        success: false,
        error: "No user ID available",
      };
    }

    return this.makeRequest<User>("/users/profile");
  }

  // Clue endpoints
  async getUserClues(): Promise<ApiResponse<Clue[]>> {
    return this.makeRequest<Clue[]>("/clues");
  }

  async getClue(clueId: string): Promise<ApiResponse<Clue>> {
    return this.makeRequest<Clue>(`/clues/${clueId}`);
  }

  async unlockClue(
    clueId: string,
    password: string
  ): Promise<ApiResponse<any>> {
    if (!this.userId) {
      return {
        success: false,
        error: "No user ID available",
      };
    }

    return this.makeRequest<any>(`/clues/${clueId}/unlock`, {
      method: "POST",
      body: JSON.stringify({
        userId: this.userId,
        password,
      }),
    });
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<any>> {
    return this.makeRequest<any>("/health");
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient(BASE_URL);

// Helper functions for API routes
export async function validateRequestBody<T>(
  request: NextRequest,
  schema: ZodSchema<T>
): Promise<
  { success: true; data: T } | { success: false; response: NextResponse }
> {
  try {
    const body = await request.json();
    const validatedData = schema.parse(body);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        response: NextResponse.json(
          {
            success: false,
            error: "Validation failed",
            details: error.issues,
          },
          { status: 400 }
        ),
      };
    }
    return {
      success: false,
      response: NextResponse.json(
        {
          success: false,
          error: "Invalid request body",
        },
        { status: 400 }
      ),
    };
  }
}

export function getUserIdFromRequest(request: NextRequest): string | null {
  // Try to get from headers first
  const headerUserId = request.headers.get("x-user-id");
  if (headerUserId) return headerUserId;

  // Try to get from query params
  const url = new URL(request.url);
  const queryUserId = url.searchParams.get("userId");
  if (queryUserId) return queryUserId;

  return null;
}

export function createErrorResponse(
  message: string,
  status: number = 500
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status }
  );
}

export function createSuccessResponse<T>(
  data: T,
  status: number = 200
): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

export async function findUserById(userId: string): Promise<User | null> {
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !user) {
    return null;
  }

  return user;
}

export async function findUserByUsername(
  username: string
): Promise<User | null> {
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("name", username)
    .single();

  if (error && error.code !== "PGRST116") {
    throw new Error("Database query failed");
  }

  return user;
}

export async function createUser(
  username: string
): Promise<{ success: true; data: User } | { success: false; error: string }> {
  try {
    const { data: newUser, error } = await supabase
      .from("users")
      .insert([{ name: username }])
      .select()
      .single();

    if (error) {
      return { success: false, error: "Failed to create user" };
    }

    return { success: true, data: newUser };
  } catch {
    return { success: false, error: "Failed to create user" };
  }
}

interface UserClueProgress {
  id: string;
  title: string;
  order_index: number;
  unlocked_at: string | null;
}

export async function getUserClues(
  userId: string
): Promise<
  | { success: true; data: UserClueProgress[] }
  | { success: false; error: string }
> {
  try {
    const { data: userProgress, error: progressError } = await supabase
      .from("clues")
      .select(
        `
      id,
      title,
      order_index,
      user_progress (
        unlocked_at
      )
    `
      )
      .eq("user_progress.user_id", userId)
      .order("order_index", { ascending: true });

    if (progressError) {
      return { success: false, error: "Failed to fetch user progress" };
    }

    const clues = userProgress.map((progress) => ({
      id: progress.id,
      title: progress.title,
      order_index: progress.order_index,
      unlocked_at: progress.user_progress[0]?.unlocked_at || null,
    }));

    return { success: true, data: clues };
  } catch {
    return { success: false, error: "Failed to fetch user progress" };
  }
}

// Export types for convenience
export type { ApiResponse, Clue, CreateUserRequest, User };
