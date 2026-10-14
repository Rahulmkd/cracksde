import type { Request, Response, NextFunction } from "express";
import { SavedResourceService } from "./saved-resource.service.js";
import { getAuthenticatedUser } from "../../lib/auth-helper.js";
import { sendSuccess } from "../../shared/utils/response.util.js";
import { UnauthorizedError, BadRequestError } from "../../shared/errors/app-error.js";

export class SavedResourceController {
  /**
   * GET /api/saved-resources
   * List all saved resources for the authenticated user
   */
  static async getSavedResources(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await getAuthenticatedUser(req);
      if (!user) {
        throw new UnauthorizedError("Authentication required to view saved resources");
      }

      const data = await SavedResourceService.getSavedResources(user.id);
      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/saved-resources
   * Save a new link for the authenticated user
   */
  static async createSavedResource(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await getAuthenticatedUser(req);
      if (!user) {
        throw new UnauthorizedError("Authentication required to save resources");
      }

      const { url } = req.body;
      if (!url || typeof url !== "string") {
        throw new BadRequestError("URL is required");
      }

      const data = await SavedResourceService.createSavedResource(user.id, url);
      sendSuccess(res, data, 201, "Resource saved successfully");
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/saved-resources/:id
   * Delete a saved resource
   */
  static async deleteSavedResource(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await getAuthenticatedUser(req);
      if (!user) {
        throw new UnauthorizedError("Authentication required to delete saved resources");
      }

      const idParam = req.params.id;
      const id = Array.isArray(idParam) ? idParam[0] : idParam;
      if (!id) {
        throw new BadRequestError("Resource ID is required");
      }

      const data = await SavedResourceService.deleteSavedResource(user.id, id);
      sendSuccess(res, data, 200, data.message);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/saved-resources/:id/bookmark
   * Toggles or sets bookmark status on a saved resource
   */
  static async toggleBookmark(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await getAuthenticatedUser(req);
      if (!user) {
        throw new UnauthorizedError("Authentication required to bookmark resources");
      }

      const idParam = req.params.id;
      const id = Array.isArray(idParam) ? idParam[0] : idParam;
      if (!id) {
        throw new BadRequestError("Resource ID is required");
      }

      const { isBookmarked } = req.body || {};
      const data = await SavedResourceService.toggleBookmark(user.id, id, isBookmarked);
      sendSuccess(
        res,
        data,
        200,
        data.isBookmarked ? "Resource bookmarked" : "Bookmark removed"
      );
    } catch (error) {
      next(error);
    }
  }
}
