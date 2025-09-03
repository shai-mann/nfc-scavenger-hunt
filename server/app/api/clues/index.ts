import { NextRequest } from "next/server";
import {
  createErrorResponse,
  createSuccessResponse,
  getUserIdFromRequest,
} from "../../../lib/api";

export async function GET(request: NextRequest) {
  // Get user ID from request
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return createErrorResponse("User ID required", 401);
  }

  console.log("userId", userId);

  // Get user's unlocked clues
  // const cluesResult = await getUserClues(userId);
  // if (!cluesResult.success) {
  //   return createErrorResponse(cluesResult.error, 500);
  // }

  // return createSuccessResponse(cluesResult.data);
  return createSuccessResponse([]);
}
