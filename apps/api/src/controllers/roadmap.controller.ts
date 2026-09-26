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

