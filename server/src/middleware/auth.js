import UserService from "../services/UserService";
import { ValidationError } from "../utils/errors";

// Middleware to extract and validate user authentication from request
export const requireAuth = async (req, res, next) => {
  try {
    // Extract userId from different sources based on HTTP method
    let userId;

    if (req.method === "GET") {
      userId = req.query.userId;
    } else {
      userId = req.body.userId;
    }

    // Check if userId is provided
    if (!userId) {
      throw new ValidationError("User ID is required");
    }

    // Validate user exists
    await UserService.validateUserExists(userId);

    // Attach userId to request object for controllers
    req.userId = userId;

    next();
  } catch (error) {
    next(error);
  }
};

// Optional auth middleware (doesn't fail if no user provided)
export const optionalAuth = async (req, res, next) => {
  try {
    let userId;

    if (req.method === "GET") {
      userId = req.query.userId;
    } else {
      userId = req.body.userId;
    }

    if (userId) {
      const parsedUserId = parseInt(userId, 10);
      if (!isNaN(parsedUserId)) {
        await UserService.validateUserExists(parsedUserId);
        req.userId = parsedUserId;
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};
