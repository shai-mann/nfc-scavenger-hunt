import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import { ValidationError } from "../utils/errors";

type ValidationTarget = "body" | "params" | "query";

export const validateRequest = <T>(
  schema: ZodSchema<T>,
  target: ValidationTarget = "body"
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      let dataToValidate;

      switch (target) {
        case "body":
          dataToValidate = req.body;
          break;
        case "params":
          dataToValidate = req.params;
          break;
        case "query":
          dataToValidate = req.query;
          break;
        default:
          dataToValidate = req.body;
      }

      const result = schema.safeParse(dataToValidate);

      if (!result.success) {
        const errorMessages = result.error.issues
          .map((err: any) => `${err.path.join(".")}: ${err.message}`)
          .join(", ");
        throw new ValidationError(errorMessages);
      }

      // Replace the original data with validated/transformed data
      switch (target) {
        case "body":
          req.body = result.data;
          break;
        case "params":
          req.params = result.data as any;
          break;
        case "query":
          req.query = result.data as any;
          break;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
