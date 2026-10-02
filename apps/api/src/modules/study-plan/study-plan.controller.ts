import type { Request, Response, NextFunction } from "express";
import { StudyPlanService } from "./study-plan.service.js";
import { getAuthenticatedUser } from "../../lib/auth-helper.js";
import { sendSuccess } from "../../shared/utils/response.util.js";
import { BadRequestError, UnauthorizedError } from "../../shared/errors/app-error.js";

export class StudyPlanController {
  /**
   * GET /api/study-plans or GET /api/study-plans/:slug
   * Returns study plan data scoped to the authenticated user's progress.
   */
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

  /**
   * PATCH /api/study-plans/tasks/:taskId
   * Updates task completion state for the authenticated user.
   */
  static async updateStudyTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await getAuthenticatedUser(req);
      if (!user) {
        throw new UnauthorizedError("Authentication required to update study tasks");
      }

      const rawTaskId = req.params.taskId;
      const taskIdStr = Array.isArray(rawTaskId) ? rawTaskId[0] : rawTaskId;
      if (!taskIdStr) throw new BadRequestError("Task ID is required");

      const parsedTaskId = BigInt(taskIdStr);
      const data = await StudyPlanService.updateStudyTask(parsedTaskId, req.body, user.id);
      sendSuccess(res, data, 200, "Task progress updated successfully");
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/study-plans/:slug
   * Updates study plan metadata.
   */
  static async updateStudyPlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await getAuthenticatedUser(req);
      if (!user) {
        throw new UnauthorizedError("Authentication required to update study plan");
      }

      const rawSlug = req.params.slug || "crack-sde";
      const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;

      const data = await StudyPlanService.updateStudyPlan(slug, req.body, user.id);
      sendSuccess(res, data, 200, "Study plan updated successfully");
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/study-plans/revision-list
   * Returns revision tasks for the authenticated user.
   */
  static async getRevisionList(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await getAuthenticatedUser(req);
      const data = await StudyPlanService.getRevisionList(user?.id);
      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/study-plans or DELETE /api/study-plans/:slug
   * Safely resets/deletes current user's study plan progress
   */
  static async deleteStudyPlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await getAuthenticatedUser(req);
      if (!user) {
        throw new UnauthorizedError("Authentication required to delete study plan");
      }

      const rawSlug = req.params.slug || "crack-sde";
      const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;

      const data = await StudyPlanService.deleteUserStudyPlan(slug, user.id);
      sendSuccess(res, data, 200, "Study plan and progress deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}
