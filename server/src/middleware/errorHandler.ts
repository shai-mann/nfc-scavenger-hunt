import { Request, Response, NextFunction } from 'express';
import {
  ConflictError,
  ForbiddenError,
  LockedError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from '../utils/errors';

interface DatabaseError extends Error {
  code?: string;
}

export const errorHandler = (
  err: DatabaseError, 
  req: Request, 
  res: Response, 
  next: NextFunction
): void => {
  console.error('Error:', err);

  // Handle custom application errors
  if (err instanceof ValidationError) {
    res.status(err.statusCode).json({
      error: 'Validation error',
      message: err.message,
    });
    return;
  }

  if (err instanceof UnauthorizedError) {
    res.status(err.statusCode).json({
      error: 'Unauthorized',
      message: err.message,
    });
    return;
  }

  if (err instanceof ForbiddenError) {
    res.status(err.statusCode).json({
      error: 'Forbidden',
      message: err.message,
    });
    return;
  }

  if (err instanceof NotFoundError) {
    res.status(err.statusCode).json({
      error: 'Not found',
      message: err.message,
    });
    return;
  }

  if (err instanceof ConflictError) {
    res.status(err.statusCode).json({
      error: 'Conflict',
      message: err.message,
    });
    return;
  }

  if (err instanceof LockedError) {
    res.status(err.statusCode).json({
      error: 'Locked',
      message: err.message,
    });
    return;
  }

  // Handle database errors
  if (err.code === '23505') {
    // Unique violation
    res.status(409).json({
      error: 'Conflict',
      message: 'Resource already exists',
    });
    return;
  }

  if (err.code === '23503') {
    // Foreign key violation
    res.status(400).json({
      error: 'Bad request',
      message: 'Invalid reference',
    });
    return;
  }

  // Handle generic errors
  res.status(500).json({
    error: 'Internal server error',
    message: 'Something went wrong on the server',
  });
};