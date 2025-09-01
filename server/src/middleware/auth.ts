import { Request, Response, NextFunction } from 'express';
import UserService from '../services/UserService';
import { ValidationError } from '../utils/errors';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

// Middleware to extract and validate user authentication from request
export const requireAuth = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    // Extract userId from different sources based on HTTP method
    let userId: string | undefined;

    if (req.method === 'GET') {
      userId = req.query.userId as string;
    } else {
      userId = req.body.userId as string;
    }

    // Check if userId is provided
    if (!userId) {
      throw new ValidationError('User ID is required');
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
export const optionalAuth = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    let userId: string | undefined;

    if (req.method === 'GET') {
      userId = req.query.userId as string;
    } else {
      userId = req.body.userId as string;
    }

    if (userId) {
      // For optional auth, we validate the user if provided
      await UserService.validateUserExists(userId);
      req.userId = userId;
    }

    next();
  } catch (error) {
    next(error);
  }
};