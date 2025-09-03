import { VercelRequest, VercelResponse } from "@vercel/node";
import {
  createErrorResponse,
  createSuccessResponse,
  getUserClues,
  getUserIdFromRequest,
  withMethodRestriction,
} from "../../lib/api";

async function cluesHandler(req: VercelRequest, res: VercelResponse) {
  // Get user ID from request
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    createErrorResponse(res, "User ID required", 401);
    return;
  }

  // Get user's unlocked clues
  const cluesResult = await getUserClues(userId);
  if (!cluesResult.success) {
    createErrorResponse(res, cluesResult.error, 500);
    return;
  }

  createSuccessResponse(res, cluesResult.data);
}

export default withMethodRestriction(["GET"], cluesHandler);
