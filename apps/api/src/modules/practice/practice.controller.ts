import type { Request, Response, NextFunction } from "express";
import { PracticeService } from "./practice.service.js";
import { getAuthenticatedUser } from "../../lib/auth-helper.js";
import { sendSuccess } from "../../shared/utils/response.util.js";

export class PracticeController {
  static async getPracticeProblems(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await getAuthenticatedUser(req);
      const data = await PracticeService.getPracticeProblems(req.query as any, user?.id);
      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }
}
