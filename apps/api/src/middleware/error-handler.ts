import type { Request, Response, NextFunction } from "express";
import { AppError } from "../shared/errors/app-error.js";
import { ZodError } from "zod";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Operational App Error
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
    return;
  }

  // Zod Validation Error
  if (err instanceof ZodError) {
    const message = err.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ");
    res.status(400).json({
      success: false,
      error: `Validation error: ${message}`,
      details: err.errors,
    });
    return;
  }

  // Standard Error
  if (err instanceof Error) {
    console.error("Unhandled Error:", err.stack || err.message);
    res.status(500).json({
      success: false,
      error: process.env.NODE_ENV === "production" ? "Internal server error" : err.message,
    });
    return;
  }

  console.error("Unknown Error:", err);
  res.status(500).json({
    success: false,
    error: "An unexpected error occurred",
  });
}
