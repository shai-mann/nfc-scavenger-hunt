import { NextRequest } from "next/server";
import {
  createErrorResponse,
  createSuccessResponse,
  findUserById,
  getUserIdFromRequest,
} from "../../../../lib/api";

export async function GET(request: NextRequest) {
  // Get user ID from request
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return createErrorResponse("User ID required", 401);
  }

  // Get user profile
  const user = await findUserById(userId);
  if (!user) {
    return createErrorResponse("User not found", 404);
  }

  return createSuccessResponse({
    id: user.id,
    username: user.name,
    created_at: user.created_at,
  });
}
