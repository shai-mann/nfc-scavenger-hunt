import { VercelRequest, VercelResponse } from "@vercel/node";
import { ZodError } from "zod";
import { supabase } from "../../lib/supabase";
import { ClueParamsSchema } from "../../lib/types";

export = async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  try {
    // Simple auth check - get userId from headers or query params
    const userId =
      (req.headers["x-user-id"] as string) || (req.query.userId as string);

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "User ID required",
      });
    }

    // Validate clue ID
    const validatedParams = ClueParamsSchema.parse({ id: req.query.id });
    const { id: clueId } = validatedParams;

    // Check if user has unlocked this clue
    const { data: userProgress, error: progressError } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("clue_id", clueId)
      .single();

    if (progressError || !userProgress) {
      return res.status(403).json({
        success: false,
        error: "Clue not unlocked for this user",
      });
    }

    // Get the clue details
    const { data: clue, error: clueError } = await supabase
      .from("clues")
      .select("*")
      .eq("id", clueId)
      .single();

    if (clueError || !clue) {
      return res.status(404).json({
        success: false,
        error: "Clue not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: clue,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        error: "Invalid clue ID format",
      });
    }

    console.error("Get clue error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};
