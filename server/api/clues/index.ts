import { NextRequest } from "next/server";
import {
  createErrorResponse,
  createSuccessResponse,
  getUserClues,
  getUserIdFromRequest,
} from "../../lib/api";

export async function GET(request: NextRequest) {
  // Get user ID from request
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return createErrorResponse("User ID required", 401);
  }

  // Get user's unlocked clues
  const cluesResult = await getUserClues(userId);
  if (!cluesResult.success) {
    return createErrorResponse(cluesResult.error, 500);
  }

  return createSuccessResponse(cluesResult.data);
}
