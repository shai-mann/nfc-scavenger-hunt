import { VercelRequest, VercelResponse } from "@vercel/node";
import {
  createErrorResponse,
  createSuccessResponse,
  findUserById,
  getUserIdFromRequest,
  updateUser,
  validateRequestBody,
  withMethodRestriction,
} from "../../lib/api";
import { UpdateUserSchema } from "../../lib/types";

// Handler for GET requests
async function getProfileHandler(req: VercelRequest, res: VercelResponse) {
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

// Handler for POST requests
async function updateProfileHandler(req: VercelRequest, res: VercelResponse) {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    createErrorResponse(res, "User ID required", 401);
    return;
  }

  const validatedData = await validateRequestBody(req, res, UpdateUserSchema);
  if (!validatedData) {
    return; // Response already sent by validateRequestBody
  }
  const { username } = validatedData;

  const response = await updateUser(userId, { name: username });
  if (!response.success) {
    createErrorResponse(res, response.error, 500);
    return;
  }

  createSuccessResponse(res, response.data);
}

async function profileHandler(req: VercelRequest, res: VercelResponse) {
  switch (req.method) {
    case "GET":
      return getProfileHandler(req, res);
    case "POST":
      return updateProfileHandler(req, res);
    default:
      createErrorResponse(res, "Method not allowed", 405);
      return;
  }
}

export default withMethodRestriction(["GET", "POST"], profileHandler);
