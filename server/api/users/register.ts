import { VercelRequest, VercelResponse } from "@vercel/node";
import {
  createErrorResponse,
  createSuccessResponse,
  createUser,
  findUserByUsername,
  validateRequestBody,
  withMethodRestriction,
} from "../../lib/api";
import { CreateUserSchema } from "../../lib/types";

async function registerHandler(req: VercelRequest, res: VercelResponse) {
  // Validate request body
  const validatedData = await validateRequestBody(req, res, CreateUserSchema);
  if (!validatedData) {
    return; // Response already sent by validateRequestBody
  }

  const { username } = validatedData;

  // Check if username already exists
  const existingUser = await findUserByUsername(username);
  if (existingUser) {
    createErrorResponse(res, "This username is already registered", 409);
    return;
  }

  // Create new user
  const userResult = await createUser(username);
  if (!userResult.success) {
    createErrorResponse(res, userResult.error, 500);
    return;
  }

  createSuccessResponse(
    res,
    {
      id: userResult.data.id,
      username: userResult.data.name,
      created_at: userResult.data.created_at,
    },
    201
  );
}

export default withMethodRestriction(["POST"], registerHandler);
