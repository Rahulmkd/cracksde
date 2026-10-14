import { SavedResourceRepository } from "./saved-resource.repository.js";
import { extractUrlMetadata } from "./metadata.service.js";
import { NotFoundError, ForbiddenError } from "../../shared/errors/app-error.js";
import type { SavedResourceDto } from "@cracksde/shared";

function toDto(item: any): SavedResourceDto {
  return {
    id: item.id,
    userId: item.userId,
    url: item.url,
    title: item.title,
    domain: item.domain,
    favicon: item.favicon,
    createdAt: item.createdAt instanceof Date ? item.createdAt.toISOString() : String(item.createdAt),
    updatedAt: item.updatedAt instanceof Date ? item.updatedAt.toISOString() : String(item.updatedAt),
  };
}

export class SavedResourceService {
  /**
   * Retrieves all saved resources for the specified user
   */
  static async getSavedResources(userId: string): Promise<SavedResourceDto[]> {
    const items = await SavedResourceRepository.findAllByUserId(userId);
    return items.map(toDto);
  }

  /**
   * Extracts metadata for the provided URL and saves the resource linked to the user
   */
  static async createSavedResource(userId: string, rawUrl: string): Promise<SavedResourceDto> {
    const metadata = await extractUrlMetadata(rawUrl);

    const created = await SavedResourceRepository.create({
      userId,
      url: metadata.url,
      title: metadata.title,
      domain: metadata.domain,
      favicon: metadata.favicon,
    });

    return toDto(created);
  }

  /**
   * Deletes a saved resource after verifying ownership
   */
  static async deleteSavedResource(userId: string, resourceId: string): Promise<{ message: string }> {
    const existing = await SavedResourceRepository.findById(resourceId);

    if (!existing) {
      throw new NotFoundError("Saved resource not found");
    }

    if (existing.userId !== userId) {
      throw new ForbiddenError("You do not have permission to delete this saved resource");
    }

    await SavedResourceRepository.delete(resourceId);

    return { message: "Saved resource deleted successfully" };
  }
}
