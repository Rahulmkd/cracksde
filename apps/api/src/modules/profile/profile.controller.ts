import type { Request, Response, NextFunction } from "express";
import { ProfileService } from "./profile.service.js";
import { getAuthenticatedUser } from "../../lib/auth-helper.js";
import { sendSuccess } from "../../shared/utils/response.util.js";
import { UnauthorizedError } from "../../shared/errors/app-error.js";

export class ProfileController {
  /**
   * GET /api/profile
   * Returns current user's profile and stats
   */
  static async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await getAuthenticatedUser(req);
      if (!user) {
        throw new UnauthorizedError("Authentication required to access profile");
      }

      const data = await ProfileService.getProfile(user.id);
      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/profile or PUT /api/profile
   * Updates current user's profile details
   */
  static async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await getAuthenticatedUser(req);
      if (!user) {
        throw new UnauthorizedError("Authentication required to update profile");
      }

      const data = await ProfileService.updateProfile(user.id, req.body);
      sendSuccess(res, data, 200, "Profile updated successfully");
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/profile/stats
   * Returns current user's learning stats and recent activity
   */
  static async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await getAuthenticatedUser(req);
      if (!user) {
        throw new UnauthorizedError("Authentication required to access learning stats");
      }

      const data = await ProfileService.getProfileStats(user.id);
      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }
}
