import { z } from "zod";

// User schemas
export const CreateUserSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .max(50, "Username must be 50 characters or less")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, numbers, hyphens, and underscores"
    ),
});

export const UserParamsSchema = z.object({
  id: z.string().uuid("Invalid user ID format"),
});

// Clue schemas
export const ClueParamsSchema = z.object({
  id: z.string().uuid("Invalid clue ID format"),
});

export const VerifyCluePasswordSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

export const CompleteClueSchema = z.object({
  userId: z.string().uuid("Invalid user ID format"),
  password: z.string().min(1, "Password is required"),
});

// Progress schemas
export const UserProgressParamsSchema = z.object({
  user_id: z.string().uuid("Invalid user ID format"),
});

// Export types
export type CreateUserRequest = z.infer<typeof CreateUserSchema>;
export type UserParams = z.infer<typeof UserParamsSchema>;
export type ClueParams = z.infer<typeof ClueParamsSchema>;
export type VerifyCluePasswordRequest = z.infer<
  typeof VerifyCluePasswordSchema
>;
export type CompleteClueRequest = z.infer<typeof CompleteClueSchema>;
export type UserProgressParams = z.infer<typeof UserProgressParamsSchema>;

// Database models
export interface User {
  id: string;
  name: string;
  created_at: string;
}

export interface Clue {
  id: string;
  title: string;
  description: string;
  nfc_tag_id: string;
  order_index: number;
  created_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  clue_id: string;
  unlocked_at: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  statusCode?: number;
}
