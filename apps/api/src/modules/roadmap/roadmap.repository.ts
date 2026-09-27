import { prisma } from "../../lib/prisma.js";

export class RoadmapRepository {
  static async findSubjectsWithCounts() {
    return prisma.roadmapSubject.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        _count: {
          select: {
            topics: true,
            items: true,
          },
        },
        topics: {
          select: {
            id: true,
            _count: {
              select: {
                subtopics: true,
                items: true,
              },
            },
          },
        },
      },
    });
  }

  static async findSubjectBySlug(slug: string) {
    return prisma.roadmapSubject.findUnique({
      where: { slug },
      include: {
        topics: {
          orderBy: { sortOrder: "asc" },
          include: {
            subtopics: {
              orderBy: { sortOrder: "asc" },
              include: {
                items: {
                  orderBy: { sortOrder: "asc" },
                },
              },
            },
            items: {
              orderBy: { sortOrder: "asc" },
            },
          },
        },
      },
    });
  }

  static async findSubjectById(id: number) {
    return prisma.roadmapSubject.findUnique({
      where: { id },
    });
  }

  static async findTopicById(id: number) {
    return prisma.roadmapTopic.findUnique({
      where: { id },
      include: {
        subject: { select: { id: true, slug: true, name: true } },
        subtopics: {
          orderBy: { sortOrder: "asc" },
          select: { id: true, name: true, slug: true, sortOrder: true },
        },
        items: {
          orderBy: { sortOrder: "asc" },
          include: {
            subtopic: { select: { id: true, name: true, slug: true } },
          },
        },
      },
    });
  }

  static async findTopicBySubjectAndSlug(subjectSlug: string, topicSlug: string) {
    return prisma.roadmapTopic.findFirst({
      where: {
        slug: topicSlug,
        subject: { slug: subjectSlug },
      },
      include: {
        subject: { select: { id: true, slug: true, name: true } },
        subtopics: {
          orderBy: { sortOrder: "asc" },
          select: { id: true, name: true, slug: true, sortOrder: true },
        },
        items: {
          orderBy: { sortOrder: "asc" },
          include: {
            subtopic: { select: { id: true, name: true, slug: true } },
          },
        },
      },
    });
  }

  static async findSubtopicById(id: number) {
    return prisma.roadmapSubtopic.findUnique({
      where: { id },
    });
  }

  static async findItemById(id: number) {
    return prisma.roadmapItem.findUnique({
      where: { id },
    });
  }

  static async findUserProgressForUser(userId: string) {
    return prisma.userItemProgress.findMany({
      where: { userId },
      include: {
        item: {
          select: { subjectId: true },
        },
      },
    });
  }

  static async findUserProgressForSubject(userId: string, subjectId: number) {
    return prisma.userItemProgress.findMany({
      where: {
        userId,
        item: { subjectId },
      },
    });
  }

  static async findUserProgressForItems(userId: string, itemIds: number[]) {
    return prisma.userItemProgress.findMany({
      where: {
        userId,
        itemId: { in: itemIds },
      },
    });
  }

  static async findSingleUserProgress(userId: string, itemId: number) {
    return prisma.userItemProgress.findUnique({
      where: {
        uq_user_roadmap_item_progress: {
          userId,
          itemId,
        },
      },
    });
  }

  static async upsertUserProgress(
    userId: string,
    itemId: number,
    data: {
      status: string;
      solveCount: number;
      lastSolvedAt: Date;
      nextRevisionAt: Date;
      lastScore: boolean;
      notes?: string | null;
      completedAt: Date | null;
    }
  ) {
    return prisma.userItemProgress.upsert({
      where: {
        uq_user_roadmap_item_progress: {
          userId,
          itemId,
        },
      },
      update: {
        status: data.status,
        solveCount: data.solveCount,
        lastSolvedAt: data.lastSolvedAt,
        nextRevisionAt: data.nextRevisionAt,
        lastScore: data.lastScore,
        notes: data.notes !== undefined ? data.notes : undefined,
        completedAt: data.completedAt,
      },
      create: {
        userId,
        itemId,
        status: data.status,
        solveCount: data.solveCount,
        lastSolvedAt: data.lastSolvedAt,
        nextRevisionAt: data.nextRevisionAt,
        lastScore: data.lastScore,
        notes: data.notes ?? null,
        completedAt: data.completedAt,
      },
    });
  }

  static async findTasksByItemId(itemId: number) {
    return prisma.studyTask.findMany({
      where: { itemId },
    });
  }

  static async completeMatchingStudyTasks(itemId: number) {
    await prisma.studyTask.updateMany({
      where: { itemId },
      data: { status: "completed" },
    });
  }

  static async recalculateDayProgress(dayId: bigint) {
    const completedCount = await prisma.studyTask.count({
      where: { dayId, status: "completed" },
    });
    const totalCount = await prisma.studyTask.count({
      where: { dayId },
    });

    const status = completedCount >= totalCount && totalCount > 0
      ? "completed"
      : completedCount > 0
      ? "in_progress"
      : "upcoming";

    return prisma.studyDay.update({
      where: { dayId },
      data: {
        tasksCompleted: completedCount,
        status,
      },
    });
  }

  static async findUserRevisionProgress(userId: string) {
    return prisma.userItemProgress.findMany({
      where: {
        userId,
        solveCount: { gt: 0 },
      },
      include: {
        item: {
          include: {
            subject: { select: { id: true, slug: true, name: true } },
            topic: { select: { id: true, slug: true, name: true } },
            subtopic: { select: { id: true, slug: true, name: true } },
          },
        },
      },
      orderBy: [{ nextRevisionAt: "asc" }],
    });
  }

  static async getMaxItemNo() {
    const maxItem = await prisma.roadmapItem.aggregate({
      _max: { itemNo: true },
    });
    return (maxItem._max.itemNo || 0) + 1;
  }

  static async getMaxSortOrderForTopic(topicId: number) {
    const maxSort = await prisma.roadmapItem.aggregate({
      where: { topicId },
      _max: { sortOrder: true },
    });
    return (maxSort._max.sortOrder || 0) + 1;
  }

  static async findItemWithSlugInTopic(topicId: number, slug: string) {
    return prisma.roadmapItem.findFirst({
      where: { topicId, slug },
    });
  }

  static async createRoadmapItem(data: {
    title: string;
    slug: string;
    subjectId: number;
    topicId: number;
    subtopicId: number | null;
    itemNo: number;
    sortOrder: number;
    difficulty: string;
    estimatedMinutes: number;
    type: string;
  }) {
    return prisma.roadmapItem.create({
      data,
      include: {
        subject: { select: { id: true, slug: true, name: true } },
        topic: { select: { id: true, slug: true, name: true } },
        subtopic: { select: { id: true, slug: true, name: true } },
      },
    });
  }

  static async getRoadmapSummaryView() {
    return prisma.$queryRawUnsafe("SELECT * FROM v_roadmap_summary;");
  }
}
