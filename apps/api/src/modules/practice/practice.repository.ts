import { prisma } from "../../lib/prisma.js";
import type { Prisma } from "@prisma/client";

export class PracticeRepository {
  /**
   * Find all progress records for a given user
   */
  static async findUserProgressList(userId: string) {
    return prisma.userItemProgress.findMany({
      where: { userId },
    });
  }

  /**
   * Find all starred/revision study tasks with non-null item IDs
   */
  static async findStarredRevisionTaskItemIds() {
    return prisma.studyTask.findMany({
      where: { isRevision: true, itemId: { not: null } },
      select: { itemId: true },
    });
  }

  /**
   * Count roadmap items matching where criteria
   */
  static async countProblems(where: Prisma.RoadmapItemWhereInput) {
    return prisma.roadmapItem.count({ where });
  }

  /**
   * Count total roadmap items in database
   */
  static async countAllProblems() {
    return prisma.roadmapItem.count();
  }

  /**
   * Find paginated roadmap items with subject, topic, and subtopic info
   */
  static async findProblems(
    where: Prisma.RoadmapItemWhereInput,
    skip: number,
    take: number
  ) {
    return prisma.roadmapItem.findMany({
      where,
      orderBy: [
        { subject: { sortOrder: "asc" } },
        { topic: { sortOrder: "asc" } },
        { sortOrder: "asc" },
      ],
      skip,
      take,
      include: {
        subject: { select: { id: true, slug: true, name: true } },
        topic: { select: { id: true, slug: true, name: true } },
        subtopic: { select: { id: true, slug: true, name: true } },
      },
    });
  }
}
