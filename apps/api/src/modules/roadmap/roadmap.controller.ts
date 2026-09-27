import type { Request, Response, NextFunction } from "express";
import { RoadmapService } from "./roadmap.service.js";
import { getAuthenticatedUser } from "../../lib/auth-helper.js";
import { sendSuccess } from "../../shared/utils/response.util.js";
import { UnauthorizedError, BadRequestError } from "../../shared/errors/app-error.js";

export class RoadmapController {
  static async getSubjects(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await getAuthenticatedUser(req);
      const data = await RoadmapService.getRoadmapSubjects(user?.id);
      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }

  static async getSubjectBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const rawSlug = req.params.slug;
      const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;
      if (!slug) throw new BadRequestError("Subject slug is required");

      const user = await getAuthenticatedUser(req);
      const data = await RoadmapService.getRoadmapSubjectBySlug(slug, user?.id);
      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }

  static async getTopicQuestions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const rawTopicId = req.params.topicId;
      const rawSlug = req.params.slug;
      const rawTopicSlug = req.params.topicSlug;

      const user = await getAuthenticatedUser(req);
      const data = await RoadmapService.getTopicQuestions(
        {
          topicId: Array.isArray(rawTopicId) ? rawTopicId[0] : rawTopicId,
          slug: Array.isArray(rawSlug) ? rawSlug[0] : rawSlug,
          topicSlug: Array.isArray(rawTopicSlug) ? rawTopicSlug[0] : rawTopicSlug,
        },
        user?.id
      );
      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }

  static async solveQuestion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await getAuthenticatedUser(req);
      if (!user) throw new UnauthorizedError("Authentication required to record question progress");

      const rawItemId = req.params.itemId;
      const itemId = Number(Array.isArray(rawItemId) ? rawItemId[0] : rawItemId);
      if (isNaN(itemId)) throw new BadRequestError("Invalid item ID");

      const { isCorrect = true, notes } = req.body;
      const result = await RoadmapService.solveQuestion(itemId, isCorrect, notes, user.id);
      sendSuccess(res, result.progress, 200, result.message);
    } catch (error) {
      next(error);
    }
  }

  static async getItemProgress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await getAuthenticatedUser(req);
      if (!user) throw new UnauthorizedError("Authentication required");

      const rawItemId = req.params.itemId;
      const itemId = Number(Array.isArray(rawItemId) ? rawItemId[0] : rawItemId);
      if (isNaN(itemId)) throw new BadRequestError("Invalid item ID");

      const data = await RoadmapService.getItemProgress(itemId, user.id);
      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }

  static async getUserRevisions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await getAuthenticatedUser(req);
      const data = await RoadmapService.getUserRevisionItems(user ? user.id : null);
      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }

  static async getRoadmapSummary(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await RoadmapService.getRoadmapSummary();
      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }

  static async createRoadmapItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const newItem = await RoadmapService.createRoadmapItem(req.body);
      sendSuccess(
        res,
        {
          item: {
            id: newItem.id,
            subjectId: newItem.subjectId,
            topicId: newItem.topicId,
            subtopicId: newItem.subtopicId,
            itemNo: newItem.itemNo,
            title: newItem.title,
            slug: newItem.slug,
            type: newItem.type,
            difficulty: newItem.difficulty,
            estimatedMinutes: newItem.estimatedMinutes,
            sortOrder: newItem.sortOrder,
            subjectSlug: newItem.subject.slug,
            subjectName: newItem.subject.name,
            topicSlug: newItem.topic.slug,
            topicName: newItem.topic.name,
            subtopicName: newItem.subtopic?.name ?? null,
            progress: null,
          },
        },
        201,
        "Question created successfully"
      );
    } catch (error) {
      next(error);
    }
  }
}
