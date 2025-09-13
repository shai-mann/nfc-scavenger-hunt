import { VercelRequest, VercelResponse } from "@vercel/node";
import { ZodError, ZodSchema } from "zod";
import { supabase } from "./supabase";
import { ApiResponse, Clue, CreateUserRequest, User } from "./types";

// Method restriction helper for Vercel Functions
export function withMethodRestriction(
  allowedMethods: string[],
  handler: (req: VercelRequest, res: VercelResponse) => Promise<void>
) {
  return async (req: VercelRequest, res: VercelResponse): Promise<void> => {
    if (!allowedMethods.includes(req.method || "")) {
      res.status(405).json({
        success: false,
        error: `Method ${req.method} not allowed`,
      });
      res.setHeader("Allow", allowedMethods.join(", "));
      return;
    }
    return handler(req, res);
  };
}

// Helper functions for API routes
// Helper functions for validating request bodies in Vercel Functions
export async function validateRequestBody<T>(
  req: VercelRequest,
  res: VercelResponse,
  schema: ZodSchema<T>
): Promise<T | null> {
  try {
    const validatedData = schema.parse(req.body);
    return validatedData;
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        success: false,
        error: "Validation failed",
        details: error.issues,
      });
    } else {
      res.status(400).json({
        success: false,
        error: "Invalid request body",
      });
    }
    return null;
  }
}

export function getUserIdFromRequest(req: VercelRequest): string | null {
  // Try to get from headers first
  const headerUserId = req.headers["x-user-id"] as string;
  if (headerUserId) return headerUserId;

  // Try to get from query params
  const queryUserId = req.query.userId as string;
  if (queryUserId) return queryUserId;

  return null;
}

export function createErrorResponse(
  res: VercelResponse,
  message: string,
  status: number = 500
): void {
  res.status(status).json({
    success: false,
    error: message,
  });
}

export function createSuccessResponse<T>(
  res: VercelResponse,
  data: T,
  status: number = 200
): void {
  res.status(status).json({
    success: true,
    data,
  });
}

export async function findUserById(userId: string): Promise<User | null> {
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  console.log("findUserById", user, error);

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

export async function updateUser(
  userId: string,
  userData: Partial<Omit<User, "id" | "created_at">>
): Promise<ApiResponse<User>> {
  try {
    const user = await findUserById(userId);
    if (!user) {
      console.error("User not found");
      return { success: false, error: "User not found" };
    }

    const { data: updatedUser, error } = await supabase
      .from("users")
      .update(userData)
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      return { success: false, error: "Failed to update user" };
    }

    return { success: true, data: updatedUser };
  } catch {
    return { success: false, error: "Failed to update user" };
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
      user_progress!left (
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
