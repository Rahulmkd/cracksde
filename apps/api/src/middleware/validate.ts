import type { Request, Response, NextFunction } from "express";
import { ZodError, type ZodSchema } from "zod";

export function validateBody(schema: ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ");
        res.status(400).json({
          success: false,
          error: `Validation Error: ${message}`,
          details: error.errors,
        });
        return;
      }
      next(error);
    }
  };
}

export function validateQuery(schema: ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.query = await schema.parseAsync(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ");
        res.status(400).json({
          success: false,
          error: `Query Validation Error: ${message}`,
          details: error.errors,
        });
        return;
      }
      next(error);
    }
  };
}

export function validateParams(schema: ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.params = await schema.parseAsync(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ");
        res.status(400).json({
          success: false,
          error: `Params Validation Error: ${message}`,
          details: error.errors,
        });
        return;
      }
      next(error);
    }
  };
}
