import { NextRequest } from "next/server";
import { ZodError } from "zod";
import {
  createErrorResponse,
  createSuccessResponse,
  validateRequestBody,
} from "../../../../lib/api";
import { supabase } from "../../../../lib/supabase";
import { ClueParamsSchema, CompleteClueSchema } from "../../../../lib/types";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate clue ID
    const validatedParams = ClueParamsSchema.parse({ id: params.id });
    const { id: clueId } = validatedParams;

    // Validate request body
    const validation = await validateRequestBody(request, CompleteClueSchema);
    if (!validation.success) {
      return validation.response;
    }
    const { userId, password } = validation.data;

    // Get the clue to verify password
    const { data: clue, error: clueError } = await supabase
      .from("clues")
      .select("*")
      .eq("id", clueId)
      .single();

    if (clueError || !clue) {
      return createErrorResponse("Clue not found", 404);
    }

    // Simple password verification (in real app, this would be hashed)
    // For now, we'll use the NFC tag ID as the password
    if (password !== clue.nfc_tag_id) {
      return createErrorResponse("Incorrect password", 400);
    }

    // Check if already unlocked
    const { data: existingProgress, error: progressError } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("clue_id", clueId)
      .single();

    if (existingProgress && !progressError) {
      return createErrorResponse("Clue already unlocked", 400);
    }

    // Create progress entry
    const { data: newProgress, error: insertError } = await supabase
      .from("user_progress")
      .insert([
        {
          user_id: userId,
          clue_id: clueId,
          unlocked_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (insertError) {
      throw new Error("Failed to unlock clue");
    }

    return createSuccessResponse(
      {
        id: newProgress.id,
        user_id: newProgress.user_id,
        clue_id: newProgress.clue_id,
        unlocked_at: newProgress.unlocked_at,
      },
      201
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return createErrorResponse("Validation failed", 400);
    }

    console.error("Unlock clue error:", error);
    return createErrorResponse("Internal server error", 500);
  }
}
