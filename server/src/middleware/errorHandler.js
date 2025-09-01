import {
  ConflictError,
  ForbiddenError,
  LockedError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "../utils/errors";

export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Handle custom application errors
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({
      error: "Validation error",
      message: err.message,
    });
  }

  if (err instanceof UnauthorizedError) {
    return res.status(err.statusCode).json({
      error: "Unauthorized",
      message: err.message,
    });
  }

  if (err instanceof ForbiddenError) {
    return res.status(err.statusCode).json({
      error: "Forbidden",
      message: err.message,
    });
  }

  if (err instanceof NotFoundError) {
    return res.status(err.statusCode).json({
      error: "Not found",
      message: err.message,
    });
  }

  if (err instanceof ConflictError) {
    return res.status(err.statusCode).json({
      error: "Conflict",
      message: err.message,
    });
  }

  if (err instanceof LockedError) {
    return res.status(err.statusCode).json({
      error: "Locked",
      message: err.message,
    });
  }

  // Handle database errors
  if (err.code === "23505") {
    // Unique violation
    return res.status(409).json({
      error: "Conflict",
      message: "Resource already exists",
    });
  }

  if (err.code === "23503") {
    // Foreign key violation
    return res.status(400).json({
      error: "Bad request",
      message: "Invalid reference",
    });
  }

  // Handle generic errors
  res.status(500).json({
    error: "Internal server error",
    message: "Something went wrong on the server",
  });
};
