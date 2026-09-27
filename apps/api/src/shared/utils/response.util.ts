import type { Response } from "express";
import type { ApiResponse } from "@cracksde/shared";

export function sendSuccess<T>(
  res: Response,
  data: T,
  statusCode: number = 200,
  message?: string
): void {
  const payload: ApiResponse<T> = {
    success: true,
    data,
    ...(message ? { message } : {}),
  };
  res.status(statusCode).json(payload);
}

export function sendError(
  res: Response,
  errorMessage: string,
  statusCode: number = 500
): void {
  const payload: ApiResponse = {
    success: false,
    error: errorMessage,
  };
  res.status(statusCode).json(payload);
}
