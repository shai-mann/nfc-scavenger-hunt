import { VercelRequest, VercelResponse } from "@vercel/node";
import { ZodError, ZodSchema } from "zod";
import { supabase } from "./supabase";
import { ApiResponse, Clue, CreateUserRequest, User, UserRank } from "./types";

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

// Leaderboard functions

// Helper function to calculate consecutive clues for a user
export async function getConsecutiveClues(userId: string): Promise<{
  consecutive: number;
  total: number;
}> {
  try {
    // Get all user progress ordered by clue order
    const { data: progress, error } = await supabase
      .from("user_progress")
      .select(
        `
        clue_id,
        clues!inner (
          order_index
        )
      `
      )
      .eq("user_id", userId)
      .order("clues(order_index)", { ascending: true });

    if (error) {
      console.error("Error fetching user progress:", error);
      return { consecutive: 0, total: 0 };
    }

    if (!progress || progress.length === 0) {
      return { consecutive: 0, total: 0 };
    }

    // Sort by order_index to ensure correct order
    const sortedProgress = progress.sort(
      (a, b) => a.clues.order_index - b.clues.order_index
    );

    // Calculate consecutive clues starting from index 0
    let consecutive = 0;
    for (let i = 0; i < sortedProgress.length; i++) {
      if (sortedProgress[i].clues.order_index === consecutive) {
        consecutive++;
      } else {
        break;
      }
    }

    return {
      consecutive,
      total: progress.length,
    };
  } catch (error) {
    console.error("Error calculating consecutive clues:", error);
    return { consecutive: 0, total: 0 };
  }
}

// Get leaderboard data
export async function getLeaderboard(): Promise<{
  success: boolean;
  data?: UserRank[];
  error?: string;
}> {
  try {
    // Get all users
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id, name");

    if (usersError) {
      return { success: false, error: "Failed to fetch users" };
    }

    if (!users || users.length === 0) {
      return { success: true, data: [] };
    }

    // Calculate stats for each user
    // TODO: this is really inefficient, we should batch this query instead
    const userStats: {
      username: string;
      consecutiveClues: number;
      totalClues: number;
    }[] = [];

    for (const user of users) {
      const stats = await getConsecutiveClues(user.id);
      userStats.push({
        username: user.name,
        consecutiveClues: stats.consecutive,
        totalClues: stats.total,
      });
    }

    // Sort by consecutive clues (desc), then by total clues (desc), then by username (asc)
    userStats.sort((a, b) => {
      if (a.consecutiveClues !== b.consecutiveClues) {
        return b.consecutiveClues - a.consecutiveClues;
      }
      if (a.totalClues !== b.totalClues) {
        return b.totalClues - a.totalClues;
      }
      return a.username.localeCompare(b.username);
    });

    // Add ranks
    const leaderboard: UserRank[] = userStats.map((user, index) => ({
      ...user,
      rank: index + 1,
    }));

    return { success: true, data: leaderboard };
  } catch (error) {
    console.error("Error generating leaderboard:", error);
    return { success: false, error: "Failed to generate leaderboard" };
  }
}

// Get user rank
export async function getUserRank(userId: string): Promise<{
  success: boolean;
  data?: UserRank;
  error?: string;
}> {
  try {
    // Get leaderboard to determine rank
    const leaderboardResult = await getLeaderboard();
    if (!leaderboardResult.success || !leaderboardResult.data) {
      return {
        success: false,
        error: leaderboardResult.error || "Failed to get leaderboard",
      };
    }

    // Find user by ID to get their username
    const user = await findUserById(userId);
    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Find user in leaderboard
    const userEntry = leaderboardResult.data.find(
      (entry) => entry.username === user.name
    );
    if (!userEntry) {
      // User not in leaderboard, means they have no progress
      return {
        success: true,
        data: {
          rank: leaderboardResult.data.length + 1,
          consecutiveClues: 0,
          totalClues: 0,
          username: user.name,
        },
      };
    }

    return {
      success: true,
      data: {
        rank: userEntry.rank,
        consecutiveClues: userEntry.consecutiveClues,
        totalClues: userEntry.totalClues,
        username: user.name,
      },
    };
  } catch (error) {
    console.error("Error getting user rank:", error);
    return { success: false, error: "Failed to get user rank" };
  }
}

// Export types for convenience
export type { ApiResponse, Clue, CreateUserRequest, User };
