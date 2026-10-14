import { prisma } from "../../lib/prisma.js";

export interface CreateSavedResourceParams {
  userId: string;
  url: string;
  title: string;
  domain: string;
  favicon?: string | null;
}

export class SavedResourceRepository {
  /**
   * Find all saved resources for a given user, ordered newest first
   */
  static async findAllByUserId(userId: string) {
    return prisma.savedResource.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Find a single saved resource by its ID
   */
  static async findById(id: string) {
    return prisma.savedResource.findUnique({
      where: { id },
    });
  }

  /**
   * Create a new saved resource
   */
  static async create(data: CreateSavedResourceParams) {
    return prisma.savedResource.create({
      data: {
        userId: data.userId,
        url: data.url,
        title: data.title,
        domain: data.domain,
        favicon: data.favicon ?? null,
      },
    });
  }

  /**
   * Delete a saved resource by ID
   */
  static async delete(id: string) {
    return prisma.savedResource.delete({
      where: { id },
    });
  }

  /**
   * Update the bookmark status of a saved resource
   */
  static async updateBookmark(id: string, isBookmarked: boolean) {
    return prisma.savedResource.update({
      where: { id },
      data: { isBookmarked },
    });
  }

  /**
   * Find all bookmarked resources for a user
   */
  static async findBookmarkedByUserId(userId: string) {
    return prisma.savedResource.findMany({
      where: { userId, isBookmarked: true },
      orderBy: { updatedAt: "desc" },
    });
  }
}
