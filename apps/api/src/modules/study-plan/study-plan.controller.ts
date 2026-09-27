import type { Request, Response, NextFunction } from "express";
import { StudyPlanService } from "./study-plan.service.js";
import { getAuthenticatedUser } from "../../lib/auth-helper.js";
import { sendSuccess } from "../../shared/utils/response.util.js";
import { BadRequestError } from "../../shared/errors/app-error.js";

export class StudyPlanController {
  static async getStudyPlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const rawSlug = req.params.slug || "crack-sde";
      const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;

      const user = await getAuthenticatedUser(req);
      const data = await StudyPlanService.getStudyPlan(slug, user?.id);
      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }

  static async updateStudyTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const rawTaskId = req.params.taskId;
      const taskIdStr = Array.isArray(rawTaskId) ? rawTaskId[0] : rawTaskId;
      if (!taskIdStr) throw new BadRequestError("Task ID is required");

      const user = await getAuthenticatedUser(req);
      const parsedTaskId = BigInt(taskIdStr);
      const data = await StudyPlanService.updateStudyTask(parsedTaskId, req.body, user?.id);
      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }

  static async updateStudyPlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const rawSlug = req.params.slug || "crack-sde";
      const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;

      const data = await StudyPlanService.updateStudyPlan(slug, req.body);
      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }

  static async getRevisionList(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await getAuthenticatedUser(req);
      const data = await StudyPlanService.getRevisionList(user?.id);
      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }
}
