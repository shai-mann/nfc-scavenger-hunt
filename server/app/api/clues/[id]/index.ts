import {
  createErrorResponse,
  createSuccessResponse,
  getUserIdFromRequest,
} from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { ClueParamsSchema } from "@/lib/types";
import { NextRequest } from "next/server";
import { ZodError } from "zod";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get user ID from request
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return createErrorResponse("User ID required", 401);
    }

    // Validate clue ID
    const validatedParams = ClueParamsSchema.parse({ id: params.id });
    const { id: clueId } = validatedParams;

    // Check if user has unlocked this clue
    const { data: userProgress, error: progressError } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("clue_id", clueId)
      .single();

    if (progressError || !userProgress) {
      return createErrorResponse("Clue not unlocked for this user", 403);
    }

    // Get the clue details
    const { data: clue, error: clueError } = await supabase
      .from("clues")
      .select("*")
      .eq("id", clueId)
      .single();

    if (clueError || !clue) {
      return createErrorResponse("Clue not found", 404);
    }

    return createSuccessResponse(clue);
  } catch (error) {
    if (error instanceof ZodError) {
      return createErrorResponse("Invalid clue ID format", 400);
    }

    console.error("Get clue error:", error);
    return createErrorResponse("Internal server error", 500);
  }
}
