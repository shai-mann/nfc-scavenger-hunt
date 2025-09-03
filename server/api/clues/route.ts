import { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "../../lib/supabase";

export async function GET(req: VercelRequest, res: VercelResponse) {
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

    // Get user's unlocked clues
    const { data: userProgress, error: progressError } = await supabase
      .from("user_progress")
      .select(
        `
        clue_id,
        unlocked_at,
        clues (
          id,
          title,
          order_index
        )
      `
      )
      .eq("user_id", userId);

    if (progressError) {
      throw new Error("Failed to fetch user progress");
    }

    const clues = (userProgress || []).map((progress) => ({
      id: progress.clues.id,
      title: progress.clues.title,
      order_index: progress.clues.order_index,
      unlocked_at: progress.unlocked_at,
    }));

    return res.status(200).json({
      success: true,
      data: clues,
    });
  } catch (error) {
    console.error("Get user clues error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}
