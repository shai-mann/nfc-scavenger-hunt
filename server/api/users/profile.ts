import { VercelRequest, VercelResponse } from "@vercel/node";
import {
  createErrorResponse,
  createSuccessResponse,
  findUserById,
  getUserIdFromRequest,
  withMethodRestriction,
} from "../../lib/api";

async function profileHandler(req: VercelRequest, res: VercelResponse) {
  // Get user ID from request
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    createErrorResponse(res, "User ID required", 401);
    return;
  }

  // Get user profile
  const user = await findUserById(userId);
  if (!user) {
    createErrorResponse(res, "User not found", 404);
    return;
  }

  createSuccessResponse(res, {
    id: user.id,
    username: user.name,
    created_at: user.created_at,
  });
}

export default withMethodRestriction(["GET"], profileHandler);
