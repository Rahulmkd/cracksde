import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { getAuthenticatedUser } from "../lib/auth-helper.js";
import {
  calculateNextRevision,
  formatRevisionStatus,
  computeTopicRevisionStatus,
} from "../services/spaced-repetition.service.js";

/**
 * Get all roadmap subjects with topic/item counts and user progress stats
 */
export async function getRoadmapSubjects(req: Request, res: Response): Promise<void> {
  try {
    const user = await getAuthenticatedUser(req);

    const subjects = await prisma.roadmapSubject.findMany({
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

    // If user is authenticated, compute subject-level user progress
    let userProgressBySubject: Record<number, { solved: number; due: number }> = {};
    if (user) {
      const now = new Date();
      const progressRecords = await prisma.userItemProgress.findMany({
        where: { userId: user.id },
        include: {
          item: {
            select: { subjectId: true },
          },
        },
      });

      for (const p of progressRecords) {
        const sId = p.item.subjectId;
        if (!userProgressBySubject[sId]) {
          userProgressBySubject[sId] = { solved: 0, due: 0 };
        }
        if (p.solveCount > 0) {
          userProgressBySubject[sId].solved++;
          const statusInfo = formatRevisionStatus(p.nextRevisionAt, p.solveCount, now);
          if (statusInfo.isDue) {
            userProgressBySubject[sId].due++;
          }
        }
      }
    }

    const formattedSubjects = subjects.map((subject) => {
      let subtopicCount = 0;
      for (const t of subject.topics) {
        subtopicCount += t._count.subtopics;
      }

      const userStats = userProgressBySubject[subject.id] || { solved: 0, due: 0 };

      return {
        id: subject.id,
        slug: subject.slug,
        name: subject.name,
        description: subject.description,
        estimatedHours: Number(subject.estimatedHours),
        totalMinutes: subject.totalMinutes,
        sortOrder: subject.sortOrder,
        totalTopics: subject._count.topics,
        totalSubtopics: subtopicCount,
        totalItems: subject._count.items,
        totalSolved: userStats.solved,
        totalDue: userStats.due,
        hasRevisionDue: userStats.due > 0,
        createdAt: subject.createdAt,
        updatedAt: subject.updatedAt,
      };
    });

    res.json({
      success: true,
      data: formattedSubjects,
    });
  } catch (error) {
    console.error("Error fetching roadmap subjects:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch roadmap subjects",
    });
  }
}

/**
 * Get a specific roadmap subject by slug with full nested hierarchy and user progress
 */
export async function getRoadmapSubjectBySlug(req: Request, res: Response): Promise<void> {
  const rawSlug = req.params.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;

  if (!slug) {
    res.status(400).json({
      success: false,
      error: "Slug parameter is required",
    });
    return;
  }

  try {
    const user = await getAuthenticatedUser(req);
    const now = new Date();

    const subject = await prisma.roadmapSubject.findUnique({
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

    if (!subject) {
      res.status(404).json({
        success: false,
        error: `Roadmap subject '${slug}' not found`,
      });
      return;
    }

    // Load progress for all items under this subject if user is logged in
    const progressMap = new Map<number, {
      status: string;
      solveCount: number;
      lastSolvedAt: Date | null;
      nextRevisionAt: Date | null;
      lastScore: boolean | null;
      notes: string | null;
      completedAt: Date | null;
    }>();

    if (user) {
      const userProgressList = await prisma.userItemProgress.findMany({
        where: {
          userId: user.id,
          item: { subjectId: subject.id },
        },
      });

      for (const p of userProgressList) {
        progressMap.set(p.itemId, {
          status: p.status,
          solveCount: p.solveCount,
          lastSolvedAt: p.lastSolvedAt,
          nextRevisionAt: p.nextRevisionAt,
          lastScore: p.lastScore,
          notes: p.notes,
          completedAt: p.completedAt,
        });
      }
    }

    const formatItem = (item: {
      id: number;
      subjectId: number;
      topicId: number;
      subtopicId: number | null;
      itemNo: number;
      title: string;
      slug: string;
      type: string | null;
      difficulty: string | null;
      estimatedMinutes: number;
      sortOrder: number;
    }) => {
      const p = progressMap.get(item.id);
      const statusInfo = formatRevisionStatus(p?.nextRevisionAt ?? null, p?.solveCount ?? 0, now);

      return {
        id: item.id,
        subjectId: item.subjectId,
        topicId: item.topicId,
        subtopicId: item.subtopicId,
        itemNo: item.itemNo,
        title: item.title,
        slug: item.slug,
        type: item.type,
        difficulty: item.difficulty,
        estimatedMinutes: item.estimatedMinutes,
        sortOrder: item.sortOrder,
        progress: p
          ? {
              itemId: item.id,
              status: p.status,
              solveCount: p.solveCount,
              lastSolvedAt: p.lastSolvedAt?.toISOString() ?? null,
              nextRevisionAt: p.nextRevisionAt?.toISOString() ?? null,
              lastScore: p.lastScore,
              notes: p.notes,
              completedAt: p.completedAt?.toISOString() ?? null,
              revisionStatusText: statusInfo.text,
              isDue: statusInfo.isDue,
            }
          : {
              itemId: item.id,
              status: "not_started",
              solveCount: 0,
              lastSolvedAt: null,
              nextRevisionAt: null,
              lastScore: null,
              notes: null,
              completedAt: null,
              revisionStatusText: statusInfo.text,
              isDue: false,
            },
      };
    };

    let subjectTotalSolved = 0;
    let subjectTotalDue = 0;

    const formattedTopics = subject.topics.map((topic) => {
      const subtopicsFormatted = topic.subtopics.map((subtopic) => ({
        id: subtopic.id,
        topicId: subtopic.topicId,
        slug: subtopic.slug,
        name: subtopic.name,
        estimatedMinutes: subtopic.estimatedMinutes,
        sortOrder: subtopic.sortOrder,
        items: subtopic.items.map(formatItem),
      }));

      const directItemsFormatted = topic.items.filter((it) => it.subtopicId === null).map(formatItem);

      // Collect all topic questions
      const allTopicQuestions = [
        ...directItemsFormatted,
        ...subtopicsFormatted.flatMap((s) => s.items),
      ];

      const topicSummary = computeTopicRevisionStatus(allTopicQuestions);

      subjectTotalSolved += topicSummary.solvedQuestions;
      subjectTotalDue += topicSummary.dueQuestions;

      return {
        id: topic.id,
        subjectId: topic.subjectId,
        slug: topic.slug,
        name: topic.name,
        estimatedMinutes: topic.estimatedMinutes,
        sortOrder: topic.sortOrder,
        totalQuestions: topicSummary.totalQuestions,
        solvedQuestions: topicSummary.solvedQuestions,
        dueQuestions: topicSummary.dueQuestions,
        hasRevisionDue: topicSummary.hasRevisionDue,
        revisionStatusText: topicSummary.revisionStatusText,
        subtopics: subtopicsFormatted,
        items: directItemsFormatted,
      };
    });

    res.json({
      success: true,
      data: {
        id: subject.id,
        slug: subject.slug,
        name: subject.name,
        description: subject.description,
        estimatedHours: Number(subject.estimatedHours),
        totalMinutes: subject.totalMinutes,
        sortOrder: subject.sortOrder,
        totalSolved: subjectTotalSolved,
        totalDue: subjectTotalDue,
        hasRevisionDue: subjectTotalDue > 0,
        topics: formattedTopics,
      },
    });
  } catch (error) {
    console.error(`Error fetching roadmap subject '${slug}':`, error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch roadmap subject",
    });
  }
}

/**
 * Get all questions belonging to a specific topic, with user progress & revision info
 */
export async function getTopicQuestions(req: Request, res: Response): Promise<void> {
  const rawTopicId = req.params.topicId;
  const rawSlug = req.params.slug;
  const rawTopicSlug = req.params.topicSlug;

  const topicId = Array.isArray(rawTopicId) ? rawTopicId[0] : rawTopicId;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;
  const topicSlug = Array.isArray(rawTopicSlug) ? rawTopicSlug[0] : rawTopicSlug;

  try {
    const user = await getAuthenticatedUser(req);
    const now = new Date();

    const topicInclude = {
      subject: { select: { id: true, slug: true, name: true } },
      subtopics: {
        orderBy: { sortOrder: "asc" as const },
        select: { id: true, name: true, slug: true, sortOrder: true },
      },
      items: {
        orderBy: { sortOrder: "asc" as const },
        include: {
          subtopic: { select: { id: true, name: true, slug: true } },
        },
      },
    };

    const topic = topicId && !isNaN(Number(topicId))
      ? await prisma.roadmapTopic.findUnique({
          where: { id: Number(topicId) },
          include: topicInclude,
        })
      : slug && topicSlug
      ? await prisma.roadmapTopic.findFirst({
          where: {
            slug: topicSlug,
            subject: { slug },
          },
          include: topicInclude,
        })
      : null;

    if (!topic) {
      res.status(404).json({
        success: false,
        error: "Topic not found",
      });
      return;
    }

    // Load progress for this user
    const progressMap = new Map<number, {
      status: string;
      solveCount: number;
      lastSolvedAt: Date | null;
      nextRevisionAt: Date | null;
      lastScore: boolean | null;
      notes: string | null;
      completedAt: Date | null;
    }>();

    if (user) {
      const userProgressList = await prisma.userItemProgress.findMany({
        where: {
          userId: user.id,
          itemId: { in: topic.items.map((it) => it.id) },
        },
      });

      for (const p of userProgressList) {
        progressMap.set(p.itemId, {
          status: p.status,
          solveCount: p.solveCount,
          lastSolvedAt: p.lastSolvedAt,
          nextRevisionAt: p.nextRevisionAt,
          lastScore: p.lastScore,
          notes: p.notes,
          completedAt: p.completedAt,
        });
      }
    }

    const formattedQuestions = topic.items.map((item) => {
      const p = progressMap.get(item.id);
      const statusInfo = formatRevisionStatus(p?.nextRevisionAt ?? null, p?.solveCount ?? 0, now);

      return {
        id: item.id,
        subjectId: item.subjectId,
        topicId: item.topicId,
        subtopicId: item.subtopicId,
        itemNo: item.itemNo,
        title: item.title,
        slug: item.slug,
        type: item.type,
        difficulty: item.difficulty,
        estimatedMinutes: item.estimatedMinutes,
        sortOrder: item.sortOrder,
        subjectSlug: topic?.subject.slug,
        subjectName: topic?.subject.name,
        topicName: topic?.name,
        subtopicName: item.subtopic?.name ?? null,
        progress: p
          ? {
              itemId: item.id,
              status: p.status,
              solveCount: p.solveCount,
              lastSolvedAt: p.lastSolvedAt?.toISOString() ?? null,
              nextRevisionAt: p.nextRevisionAt?.toISOString() ?? null,
              lastScore: p.lastScore,
              notes: p.notes,
              completedAt: p.completedAt?.toISOString() ?? null,
              revisionStatusText: statusInfo.text,
              isDue: statusInfo.isDue,
            }
          : {
              itemId: item.id,
              status: "not_started",
              solveCount: 0,
              lastSolvedAt: null,
              nextRevisionAt: null,
              lastScore: null,
              notes: null,
              completedAt: null,
              revisionStatusText: statusInfo.text,
              isDue: false,
            },
      };
    });

    const topicSummary = computeTopicRevisionStatus(formattedQuestions);

    res.json({
      success: true,
      data: {
        subject: {
          id: topic.subject.id,
          slug: topic.subject.slug,
          name: topic.subject.name,
        },
        topic: {
          id: topic.id,
          slug: topic.slug,
          name: topic.name,
          estimatedMinutes: topic.estimatedMinutes,
          totalQuestions: topicSummary.totalQuestions,
          solvedQuestions: topicSummary.solvedQuestions,
          dueQuestions: topicSummary.dueQuestions,
          hasRevisionDue: topicSummary.hasRevisionDue,
          revisionStatusText: topicSummary.revisionStatusText,
        },
        questions: formattedQuestions,
      },
    });
  } catch (error) {
    console.error("Error fetching topic questions:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch topic questions",
    });
  }
}

/**
 * Record a question solve/review and update spaced repetition schedule
 */
export async function solveQuestion(req: Request, res: Response): Promise<void> {
  const rawItemId = req.params.itemId;
  const itemId = Number(Array.isArray(rawItemId) ? rawItemId[0] : rawItemId);
  const { isCorrect = true, notes } = req.body;

  if (isNaN(itemId)) {
    res.status(400).json({
      success: false,
      error: "Invalid item ID",
    });
    return;
  }

  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      res.status(401).json({
        success: false,
        error: "Authentication required to record question progress",
      });
      return;
    }

    // Verify item exists
    const item = await prisma.roadmapItem.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      res.status(404).json({
        success: false,
        error: `Question/Item #${itemId} not found`,
      });
      return;
    }

    // Load existing progress
    const existingProgress = await prisma.userItemProgress.findUnique({
      where: {
        uq_user_roadmap_item_progress: {
          userId: user.id,
          itemId,
        },
      },
    });

    const currentSolveCount = existingProgress?.solveCount ?? 0;
    const now = new Date();

    // Spaced repetition calculation in business logic layer
    const calculation = calculateNextRevision(currentSolveCount, Boolean(isCorrect), now);

    const updatedProgress = await prisma.userItemProgress.upsert({
      where: {
        uq_user_roadmap_item_progress: {
          userId: user.id,
          itemId,
        },
      },
      update: {
        status: calculation.status,
        solveCount: calculation.solveCount,
        lastSolvedAt: calculation.lastSolvedAt,
        nextRevisionAt: calculation.nextRevisionAt,
        lastScore: calculation.lastScore,
        notes: notes !== undefined ? notes : existingProgress?.notes,
        completedAt: isCorrect ? now : existingProgress?.completedAt,
      },
      create: {
        userId: user.id,
        itemId,
        status: calculation.status,
        solveCount: calculation.solveCount,
        lastSolvedAt: calculation.lastSolvedAt,
        nextRevisionAt: calculation.nextRevisionAt,
        lastScore: calculation.lastScore,
        notes: notes ?? null,
        completedAt: isCorrect ? now : null,
      },
    });

    if (isCorrect) {
      const matchingTasks = await prisma.studyTask.findMany({
        where: { itemId },
      });
      if (matchingTasks.length > 0) {
        await prisma.studyTask.updateMany({
          where: { itemId },
          data: { status: "completed" },
        });

        const dayIds = Array.from(new Set(matchingTasks.map((t) => t.dayId)));
        for (const dayId of dayIds) {
          const completedCount = await prisma.studyTask.count({
            where: { dayId, status: "completed" },
          });
          const totalCount = await prisma.studyTask.count({
            where: { dayId },
          });
          await prisma.studyDay.update({
            where: { dayId },
            data: {
              tasksCompleted: completedCount,
              status: completedCount >= totalCount && totalCount > 0 ? "completed" : completedCount > 0 ? "in_progress" : "upcoming",
            },
          });
        }
      }
    }

    const formattedRevision = formatRevisionStatus(
      updatedProgress.nextRevisionAt,
      updatedProgress.solveCount,
      now
    );

    res.json({
      success: true,
      data: {
        progress: {
          id: updatedProgress.id,
          userId: updatedProgress.userId,
          itemId: updatedProgress.itemId,
          status: updatedProgress.status,
          solveCount: updatedProgress.solveCount,
          lastSolvedAt: updatedProgress.lastSolvedAt?.toISOString() ?? null,
          nextRevisionAt: updatedProgress.nextRevisionAt?.toISOString() ?? null,
          lastScore: updatedProgress.lastScore,
          notes: updatedProgress.notes,
          completedAt: updatedProgress.completedAt?.toISOString() ?? null,
          revisionStatusText: formattedRevision.text,
          isDue: formattedRevision.isDue,
        },
        message: isCorrect
          ? `Progress saved! Next revision scheduled for ${formattedRevision.text}`
          : `Marked for early revision (${formattedRevision.text})`,
      },
    });
  } catch (error) {
    console.error(`Error recording question solve for item #${itemId}:`, error);
    res.status(500).json({
      success: false,
      error: "Failed to record question progress",
    });
  }
}

/**
 * Get single item progress for authenticated user
 */
export async function getItemProgress(req: Request, res: Response): Promise<void> {
  const rawItemId = req.params.itemId;
  const itemId = Number(Array.isArray(rawItemId) ? rawItemId[0] : rawItemId);

  if (isNaN(itemId)) {
    res.status(400).json({
      success: false,
      error: "Invalid item ID",
    });
    return;
  }

  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      res.status(401).json({
        success: false,
        error: "Authentication required",
      });
      return;
    }

    const progress = await prisma.userItemProgress.findUnique({
      where: {
        uq_user_roadmap_item_progress: {
          userId: user.id,
          itemId,
        },
      },
    });

    const now = new Date();
    const statusInfo = formatRevisionStatus(progress?.nextRevisionAt ?? null, progress?.solveCount ?? 0, now);

    res.json({
      success: true,
      data: progress
        ? {
            id: progress.id,
            userId: progress.userId,
            itemId: progress.itemId,
            status: progress.status,
            solveCount: progress.solveCount,
            lastSolvedAt: progress.lastSolvedAt?.toISOString() ?? null,
            nextRevisionAt: progress.nextRevisionAt?.toISOString() ?? null,
            lastScore: progress.lastScore,
            notes: progress.notes,
            completedAt: progress.completedAt?.toISOString() ?? null,
            revisionStatusText: statusInfo.text,
            isDue: statusInfo.isDue,
          }
        : null,
    });
  } catch (error) {
    console.error(`Error fetching item progress for #${itemId}:`, error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch item progress",
    });
  }
}

/**
 * Get all revision items for authenticated user (due + upcoming)
 */
export async function getUserRevisionItems(req: Request, res: Response): Promise<void> {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      res.json({
        success: true,
        data: {
          dueCount: 0,
          totalCount: 0,
          items: [],
        },
      });
      return;
    }

    const now = new Date();

    const progressRecords = await prisma.userItemProgress.findMany({
      where: {
        userId: user.id,
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

    const items = progressRecords.map((p) => {
      const statusInfo = formatRevisionStatus(p.nextRevisionAt, p.solveCount, now);
      return {
        id: p.item.id,
        subjectId: p.item.subjectId,
        topicId: p.item.topicId,
        subtopicId: p.item.subtopicId,
        itemNo: p.item.itemNo,
        title: p.item.title,
        slug: p.item.slug,
        type: p.item.type,
        difficulty: p.item.difficulty,
        estimatedMinutes: p.item.estimatedMinutes,
        subjectSlug: p.item.subject.slug,
        subjectName: p.item.subject.name,
        topicSlug: p.item.topic.slug,
        topicName: p.item.topic.name,
        subtopicName: p.item.subtopic?.name ?? null,
        progress: {
          id: p.id,
          userId: p.userId,
          itemId: p.itemId,
          status: p.status,
          solveCount: p.solveCount,
          lastSolvedAt: p.lastSolvedAt?.toISOString() ?? null,
          nextRevisionAt: p.nextRevisionAt?.toISOString() ?? null,
          lastScore: p.lastScore,
          notes: p.notes,
          completedAt: p.completedAt?.toISOString() ?? null,
          revisionStatusText: statusInfo.text,
          isDue: statusInfo.isDue,
        },
      };
    });

    // Sort: due items first, then upcoming by nextRevisionAt
    items.sort((a, b) => {
      if (a.progress.isDue && !b.progress.isDue) return -1;
      if (!a.progress.isDue && b.progress.isDue) return 1;
      const dateA = a.progress.nextRevisionAt ? new Date(a.progress.nextRevisionAt).getTime() : Infinity;
      const dateB = b.progress.nextRevisionAt ? new Date(b.progress.nextRevisionAt).getTime() : Infinity;
      return dateA - dateB;
    });

    const dueCount = items.filter((it) => it.progress.isDue).length;

    res.json({
      success: true,
      data: {
        dueCount,
        totalCount: items.length,
        items,
      },
    });
  } catch (error) {
    console.error("Error fetching user revision items:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch user revision items",
    });
  }
}

/**
 * Get roadmap rollup summary from SQL view
 */
export async function getRoadmapSummary(req: Request, res: Response): Promise<void> {
  try {
    const summary = await prisma.$queryRawUnsafe(`
      SELECT * FROM v_roadmap_summary;
    `);

    res.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error("Error fetching roadmap summary:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch roadmap summary",
    });
  }
}

/**
 * Get all practice problems with filtering, search, pagination, and user progress
 */
export async function getPracticeProblems(req: Request, res: Response): Promise<void> {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 50));
  const search = ((req.query.search as string) || "").trim();
  const subjectSlug = ((req.query.subject as string) || (req.query.track as string) || "all").trim().toLowerCase();
  const topicSlug = ((req.query.topic as string) || (req.query.pattern as string) || "all").trim().toLowerCase();
  const difficulty = ((req.query.difficulty as string) || (req.query.level as string) || "all").trim().toLowerCase();
  const status = ((req.query.status as string) || "all").trim().toLowerCase();

  try {
    const user = await getAuthenticatedUser(req);
    const now = new Date();

    // 1. Load user progress and bookmarks if user is authenticated
    const progressMap = new Map<number, {
      status: string;
      solveCount: number;
      lastSolvedAt: Date | null;
      nextRevisionAt: Date | null;
      lastScore: boolean | null;
      notes: string | null;
      completedAt: Date | null;
    }>();
    const bookmarkedItemIds = new Set<number>();

    let totalSolvedCount = 0;
    let totalDueCount = 0;

    if (user) {
      const userProgressList = await prisma.userItemProgress.findMany({
        where: { userId: user.id },
      });

      for (const p of userProgressList) {
        progressMap.set(p.itemId, {
          status: p.status,
          solveCount: p.solveCount,
          lastSolvedAt: p.lastSolvedAt,
          nextRevisionAt: p.nextRevisionAt,
          lastScore: p.lastScore,
          notes: p.notes,
          completedAt: p.completedAt,
        });

        if (p.solveCount > 0 || p.status === "completed") {
          totalSolvedCount++;
          const statusInfo = formatRevisionStatus(p.nextRevisionAt, p.solveCount, now);
          if (statusInfo.isDue) {
            totalDueCount++;
          }
        }
      }

      // Check tasks marked isRevision = true in studyTask
      const starredTasks = await prisma.studyTask.findMany({
        where: { isRevision: true, itemId: { not: null } },
        select: { itemId: true },
      });
      for (const t of starredTasks) {
        if (t.itemId) bookmarkedItemIds.add(t.itemId);
      }
    }

    // 2. Build where filter for RoadmapItem
    const where: any = {};

    // Track / Subject
    if (subjectSlug !== "all") {
      where.subject = { slug: subjectSlug };
    }

    // Topic / Pattern
    if (topicSlug !== "all") {
      where.OR = [
        { topic: { slug: topicSlug } },
        { subtopic: { slug: topicSlug } },
      ];
    }

    // Search query across title, topic name, subtopic name
    if (search) {
      const searchConditions = [
        { title: { contains: search, mode: "insensitive" } },
        { topic: { name: { contains: search, mode: "insensitive" } } },
        { subtopic: { name: { contains: search, mode: "insensitive" } } },
      ];
      if (where.OR) {
        where.AND = [{ OR: where.OR }, { OR: searchConditions }];
        delete where.OR;
      } else {
        where.OR = searchConditions;
      }
    }

    // Difficulty filter
    if (difficulty !== "all") {
      const diffNorm = difficulty === "basic" ? "easy" : difficulty === "core" ? "medium" : difficulty === "pro" ? "hard" : difficulty;
      const targetDiff = diffNorm === "easy" ? "Easy" : diffNorm === "medium" ? "Medium" : "Hard";
      where.difficulty = { equals: targetDiff, mode: "insensitive" };
    }

    // Status filter
    if (status !== "all" && user) {
      if (status === "solved") {
        const solvedItemIds = Array.from(progressMap.entries())
          .filter(([_, p]) => p.solveCount > 0 || p.status === "completed")
          .map(([id]) => id);
        where.id = { in: solvedItemIds };
      } else if (status === "unsolved" || status === "not_solved") {
        const solvedItemIds = Array.from(progressMap.entries())
          .filter(([_, p]) => p.solveCount > 0 || p.status === "completed")
          .map(([id]) => id);
        where.id = { notIn: solvedItemIds };
      } else if (status === "due" || status === "revision_due") {
        const dueItemIds = Array.from(progressMap.entries())
          .filter(([_, p]) => {
            if (p.solveCount === 0) return false;
            const statusInfo = formatRevisionStatus(p.nextRevisionAt, p.solveCount, now);
            return statusInfo.isDue;
          })
          .map(([id]) => id);
        where.id = { in: dueItemIds };
      } else if (status === "upcoming" || status === "upcoming_revision") {
        const upcomingItemIds = Array.from(progressMap.entries())
          .filter(([_, p]) => {
            if (p.solveCount === 0) return false;
            const statusInfo = formatRevisionStatus(p.nextRevisionAt, p.solveCount, now);
            return !statusInfo.isDue && Boolean(p.nextRevisionAt);
          })
          .map(([id]) => id);
        where.id = { in: upcomingItemIds };
      } else if (status === "bookmarked") {
        where.id = { in: Array.from(bookmarkedItemIds) };
      }
    }

    // Count total matching items
    const totalMatching = await prisma.roadmapItem.count({ where });
    const totalAllInDb = await prisma.roadmapItem.count();

    // Fetch paginated items
    const items = await prisma.roadmapItem.findMany({
      where,
      orderBy: [
        { subject: { sortOrder: "asc" } },
        { topic: { sortOrder: "asc" } },
        { sortOrder: "asc" },
      ],
      skip: (page - 1) * limit,
      take: limit,
      include: {
        subject: { select: { id: true, slug: true, name: true } },
        topic: { select: { id: true, slug: true, name: true } },
        subtopic: { select: { id: true, slug: true, name: true } },
      },
    });

    const formattedProblems = items.map((item) => {
      const p = progressMap.get(item.id);
      const isSolved = Boolean(p && (p.solveCount > 0 || p.status === "completed"));
      const isBookmarked = bookmarkedItemIds.has(item.id) || Boolean(p && p.status === "needs_revision");
      const statusInfo = formatRevisionStatus(p?.nextRevisionAt ?? null, p?.solveCount ?? 0, now);

      // Resolve difficulty if null
      let diff = item.difficulty;
      if (!diff) {
        const subSlug = (item.subtopic?.slug || "").toLowerCase();
        if (subSlug.includes("hard")) diff = "Hard";
        else if (subSlug.includes("medium")) diff = "Medium";
        else diff = "Easy";
      }

      // User status: "Revision Due" | "Upcoming Revision" | "Solved" | "Not Solved"
      let userStatus: "not_solved" | "solved" | "due" | "upcoming" = "not_solved";
      let userStatusText = "Not Solved";

      if (isSolved) {
        if (statusInfo.isDue) {
          userStatus = "due";
          userStatusText = "Revision Due";
        } else if (p?.nextRevisionAt) {
          userStatus = "upcoming";
          userStatusText = "Upcoming Revision";
        } else {
          userStatus = "solved";
          userStatusText = "Solved";
        }
      }

      return {
        id: item.id.toString(),
        itemId: item.id,
        itemNo: item.itemNo,
        title: item.title,
        slug: item.slug,
        type: item.type || "Problem",
        difficulty: diff,
        estimatedMinutes: item.estimatedMinutes || 15,
        subject: item.subject.name,
        subjectSlug: item.subject.slug,
        topic: item.topic.name,
        topicSlug: item.topic.slug,
        subtopic: item.subtopic?.name ?? null,
        subtopicSlug: item.subtopic?.slug ?? null,
        solved: isSolved,
        bookmarked: isBookmarked,
        userStatus,
        userStatusText,
        lastSolvedAt: p?.lastSolvedAt ? p.lastSolvedAt.toISOString() : null,
        nextRevisionAt: p?.nextRevisionAt ? p.nextRevisionAt.toISOString() : null,
        solveCount: p?.solveCount || 0,
        revisionStatusText: statusInfo.text,
        isDue: statusInfo.isDue,
        progress: p
          ? {
              itemId: item.id,
              status: p.status,
              solveCount: p.solveCount,
              lastSolvedAt: p.lastSolvedAt?.toISOString() ?? null,
              nextRevisionAt: p.nextRevisionAt?.toISOString() ?? null,
              lastScore: p.lastScore,
              notes: p.notes,
              completedAt: p.completedAt?.toISOString() ?? null,
              revisionStatusText: statusInfo.text,
              isDue: statusInfo.isDue,
            }
          : null,
      };
    });

    res.json({
      success: true,
      data: {
        problems: formattedProblems,
        pagination: {
          page,
          limit,
          total: totalMatching,
          totalPages: Math.ceil(totalMatching / limit),
          hasMore: page * limit < totalMatching,
        },
        stats: {
          totalProblems: totalAllInDb,
          totalSolved: totalSolvedCount,
          totalDue: totalDueCount,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching practice problems:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch practice problems",
    });
  }
}

