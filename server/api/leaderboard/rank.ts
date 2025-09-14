import { VercelRequest, VercelResponse } from "@vercel/node";
import {
  createErrorResponse,
  createSuccessResponse,
  getUserIdFromRequest,
  getUserRank,
  withMethodRestriction,
} from "../../lib/api";

async function rankHandler(req: VercelRequest, res: VercelResponse) {
  try {
    // Get user ID from request headers
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      createErrorResponse(res, "User ID required", 401);
      return;
    }

    const result = await getUserRank(userId);

    if (!result.success) {
      createErrorResponse(res, result.error || "Failed to get user rank", 500);
      return;
    }

    createSuccessResponse(res, result.data);
  } catch (error) {
    console.error("Error in leaderboard rank endpoint:", error);
    createErrorResponse(res, "Internal server error", 500);
  }
}

export default withMethodRestriction(["GET"], rankHandler);
