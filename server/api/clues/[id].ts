import { VercelRequest, VercelResponse } from "@vercel/node";
import { ZodError } from "zod";
import {
  createErrorResponse,
  createSuccessResponse,
  getUserIdFromRequest,
  withMethodRestriction,
} from "../../lib/api";
import { supabase, supabaseAdmin } from "../../lib/supabase";
import { ClueParamsSchema } from "../../lib/types";

async function clueHandler(req: VercelRequest, res: VercelResponse) {
  try {
    // Get user ID from request
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      createErrorResponse(res, "User ID required", 401);
      return;
    }

    // Get clue ID from query params
    const clueId = req.query.id as string;

    // Validate clue ID
    const validatedParams = ClueParamsSchema.parse({ id: clueId });
    const { id: validatedClueId } = validatedParams;

    // Check if user has unlocked this clue
    const { data: userProgress, error: progressError } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("clue_id", validatedClueId)
      .single();

    if (progressError || !userProgress) {
      createErrorResponse(res, "Clue not unlocked for this user", 403);
      return;
    }

    // Get the clue details
    const { data: clue, error: clueError } = await supabase
      .from("clues")
      .select("*")
      .eq("id", validatedClueId)
      .single();

    if (clueError || !clue) {
      createErrorResponse(res, "Clue not found", 404);
      return;
    }

    // If there is an image in the clue's data, fetch that image
    const imageUrl = clue.data.image;

    if (imageUrl) {
      // create a public URL for the image from the correct bucket in Supabase
      const { data: imageURL, error: imageError } = await supabaseAdmin.storage
        .from("clue-assets")
        .createSignedUrl(imageUrl, 60);
      // replace the image data with the signed URL, so the original isn't exposed.
      clue.data.image = imageURL?.signedUrl || "";
      if (imageError || !imageURL?.signedUrl) {
        createErrorResponse(res, "Failed to get image URL", 500);
        console.error("Failed to get image URL:", imageError);
        return;
      }
    }

    createSuccessResponse(res, clue);
  } catch (error) {
    if (error instanceof ZodError) {
      createErrorResponse(res, "Invalid clue ID format", 400);
      return;
    }

    console.error("Get clue error:", error);
    createErrorResponse(res, "Internal server error", 500);
  }
}

export default withMethodRestriction(["GET"], clueHandler);
