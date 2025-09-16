import { VercelRequest, VercelResponse } from "@vercel/node";
import { ZodError } from "zod";
import {
  createErrorResponse,
  createSuccessResponse,
  validateRequestBody,
  withMethodRestriction,
} from "../../../lib/api";
import { isLocked } from "../../../lib/clue-lock-predicates";
import { supabase } from "../../../lib/supabase";
import { ClueParamsSchema, CompleteClueSchema } from "../../../lib/types";

async function unlockHandler(req: VercelRequest, res: VercelResponse) {
  try {
    // Get clue ID from query params
    const clueId = req.query.id as string;

    // Validate clue ID
    const validatedParams = ClueParamsSchema.parse({ id: clueId });
    const { id: validatedClueId } = validatedParams;

    // Validate request body
    const validatedData = await validateRequestBody(
      req,
      res,
      CompleteClueSchema
    );
    if (!validatedData) {
      return; // Response already sent by validateRequestBody
    }
    const { userId, password } = validatedData;

    // Check if already unlocked
    const { data: existingProgress, error: progressError } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("clue_id", validatedClueId)
      .single();

    if (existingProgress && !progressError) {
      createErrorResponse(res, "Clue already unlocked", 400);
      return;
    }

    // Get the clue to verify password
    const { data: clue, error: clueError } = await supabase
      .from("clues")
      .select("*")
      .eq("id", validatedClueId)
      .single();

    if (clueError || !clue) {
      createErrorResponse(res, "Clue not found", 404);
      return;
    }

    // Simple password verification (in real app, this would be hashed)
    // For now, we'll use the NFC tag ID as the password
    if (password !== clue.nfc_tag_id) {
      createErrorResponse(res, "Incorrect password", 400);
      return;
    }

    // Check if the clue is locked:
    const isClueLocked = await isLocked(clue, userId);

    if (isClueLocked) {
      createErrorResponse(res, "Clue is locked", 400);
      return;
    }

    // Create progress entry
    const { error: insertError } = await supabase
      .from("user_progress")
      .insert([
        {
          user_id: userId,
          clue_id: validatedClueId,
          unlocked_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (insertError) {
      throw new Error("Failed to unlock clue");
    }

    // If there is an image in the clue's data, fetch that image
    const imageUrl = clue.data.image;

    if (imageUrl) {
      // create a public URL for the image from the correct bucket in Supabase
      const { data: imageURL, error: imageError } = await supabase.storage
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

    createSuccessResponse(
      res,
      {
        title: clue.title,
        data: clue.data,
        order_index: clue.order_index,
      },
      201
    );
  } catch (error) {
    if (error instanceof ZodError) {
      createErrorResponse(res, "Validation failed", 400);
      return;
    }

    console.error("Unlock clue error:", error);
    createErrorResponse(res, "Internal server error", 500);
  }
}

export default withMethodRestriction(["POST"], unlockHandler);
