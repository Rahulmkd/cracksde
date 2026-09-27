import { prisma } from "../../lib/prisma.js";
import { formatRevisionStatus } from "../repetition/repetition.service.js";
import type {
  PracticeProblemDto,
  PracticeProblemsResponseDto,
  PracticeQueryInput,
} from "@cracksde/shared";

export class PracticeService {
  static async getPracticeProblems(
    query: PracticeQueryInput,
    userId?: string
  ): Promise<PracticeProblemsResponseDto> {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(100, Math.max(1, query.limit || 50));
    const search = (query.search || "").trim();
    const subjectSlug = (query.subject || query.track || "all").trim().toLowerCase();
    const topicSlug = (query.topic || query.pattern || "all").trim().toLowerCase();
    const difficulty = (query.difficulty || query.level || "all").trim().toLowerCase();
    const status = (query.status || "all").trim().toLowerCase();

    const now = new Date();

    const progressMap = new Map<number, any>();
    const bookmarkedItemIds = new Set<number>();

    let totalSolvedCount = 0;
    let totalDueCount = 0;

    if (userId) {
      const userProgressList = await prisma.userItemProgress.findMany({
        where: { userId },
      });

      for (const p of userProgressList) {
        progressMap.set(p.itemId, p);

        if (p.solveCount > 0 || p.status === "completed") {
          totalSolvedCount++;
          const statusInfo = formatRevisionStatus(p.nextRevisionAt, p.solveCount, now);
          if (statusInfo.isDue) {
            totalDueCount++;
          }
        }
      }

      const starredTasks = await prisma.studyTask.findMany({
        where: { isRevision: true, itemId: { not: null } },
        select: { itemId: true },
      });
      for (const t of starredTasks) {
        if (t.itemId) bookmarkedItemIds.add(t.itemId);
      }
    }

    const where: any = {};

    if (subjectSlug !== "all") {
      where.subject = { slug: subjectSlug };
    }

    if (topicSlug !== "all") {
      where.OR = [
        { topic: { slug: topicSlug } },
        { subtopic: { slug: topicSlug } },
      ];
    }

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

    if (difficulty !== "all") {
      const diffNorm = difficulty === "basic" ? "easy" : difficulty === "core" ? "medium" : difficulty === "pro" ? "hard" : difficulty;
      const targetDiff = diffNorm === "easy" ? "Easy" : diffNorm === "medium" ? "Medium" : "Hard";
      where.difficulty = { equals: targetDiff, mode: "insensitive" };
    }

    if (status !== "all" && userId) {
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

    const totalMatching = await prisma.roadmapItem.count({ where });
    const totalAllInDb = await prisma.roadmapItem.count();

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

    const formattedProblems: PracticeProblemDto[] = items.map((item: any) => {
      const p = progressMap.get(item.id);
      const isSolved = Boolean(p && (p.solveCount > 0 || p.status === "completed"));
      const isBookmarked = bookmarkedItemIds.has(item.id) || Boolean(p && p.status === "needs_revision");
      const statusInfo = formatRevisionStatus(p?.nextRevisionAt ?? null, p?.solveCount ?? 0, now);

      let diff = item.difficulty;
      if (!diff) {
        const subSlug = (item.subtopic?.slug || "").toLowerCase();
        if (subSlug.includes("hard")) diff = "Hard";
        else if (subSlug.includes("medium")) diff = "Medium";
        else diff = "Easy";
      }

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

    return {
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
    };
  }
}
