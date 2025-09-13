import { VercelRequest, VercelResponse } from "@vercel/node";
import {
  createErrorResponse,
  createSuccessResponse,
  getLeaderboard,
  withMethodRestriction,
} from "../lib/api";

async function leaderboardHandler(req: VercelRequest, res: VercelResponse) {
  try {
    const result = await getLeaderboard();

    if (!result.success) {
      createErrorResponse(
        res,
        result.error || "Failed to get leaderboard",
        500
      );
      return;
    }

    createSuccessResponse(res, result.data || []);
  } catch (error) {
    console.error("Error in leaderboard endpoint:", error);
    createErrorResponse(res, "Internal server error", 500);
  }
}

export default withMethodRestriction(["GET"], leaderboardHandler);
