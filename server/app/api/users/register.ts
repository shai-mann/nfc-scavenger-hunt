import { NextRequest } from "next/server";
import {
  createErrorResponse,
  createSuccessResponse,
  createUser,
  findUserByUsername,
  validateRequestBody,
} from "../../../lib/api";
import { CreateUserSchema } from "../../../lib/types";

export async function POST(request: NextRequest) {
  // Validate request body
  const validation = await validateRequestBody(request, CreateUserSchema);
  if (!validation.success) {
    return validation.response;
  }

  const { username } = validation.data;

  // Check if username already exists
  const existingUser = await findUserByUsername(username);
  if (existingUser) {
    return createErrorResponse("This username is already registered", 409);
  }

  // Create new user
  const userResult = await createUser(username);
  if (!userResult.success) {
    return createErrorResponse(userResult.error, 500);
  }

  return createSuccessResponse(
    {
      id: userResult.data.id,
      username: userResult.data.name,
      created_at: userResult.data.created_at,
    },
    201
  );
}
