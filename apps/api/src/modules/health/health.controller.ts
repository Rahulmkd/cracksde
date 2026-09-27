import type { Request, Response } from "express";
import { sendSuccess } from "../../shared/utils/response.util.js";
import type { HealthCheckResponse } from "@cracksde/shared";

export function getHealthCheck(_req: Request, res: Response): void {
  const healthData: HealthCheckResponse = {
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  };

  sendSuccess(res, healthData);
}
