import { RoadmapRepository } from "./roadmap.repository.js";
import {
  calculateNextRevision,
  formatRevisionStatus,
  computeTopicRevisionStatus,
} from "../repetition/repetition.service.js";
import { NotFoundError, BadRequestError } from "../../shared/errors/app-error.js";
import type {
  RoadmapSubjectSummaryDto,
  RoadmapSubjectDetailDto,
  TopicQuestionsResponseDto,
  UserRevisionListDto,
  UserRevisionItemDto,
  UserItemProgressDto,
  CreateRoadmapItemInput,
  RoadmapItemDto,
} from "@cracksde/shared";

export class RoadmapService {
  /**
   * Get all roadmap subjects with topic/item counts and user progress stats
   */
  static async getRoadmapSubjects(userId?: string): Promise<RoadmapSubjectSummaryDto[]> {
    const subjects = await RoadmapRepository.findSubjectsWithCounts();

    const userProgressBySubject: Record<number, { solved: number; due: number }> = {};
    if (userId) {
      const now = new Date();
      const progressRecords = await RoadmapRepository.findUserProgressForUser(userId);

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

    return subjects.map((subject: any) => {
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
      };
    });
  }

  /**
   * Get subject hierarchy by slug with nested topics, items, and user progress
   */
  static async getRoadmapSubjectBySlug(slug: string, userId?: string): Promise<RoadmapSubjectDetailDto> {
    const subject = await RoadmapRepository.findSubjectBySlug(slug);
    if (!subject) {
      throw new NotFoundError(`Roadmap subject '${slug}' not found`);
    }

    const now = new Date();
    const progressMap = new Map<number, any>();

    if (userId) {
      const userProgressList = await RoadmapRepository.findUserProgressForSubject(userId, subject.id);
      for (const p of userProgressList) {
        progressMap.set(p.itemId, p);
      }
    }

    const formatItem = (item: any): RoadmapItemDto => {
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

    const formattedTopics = subject.topics.map((topic: any) => {
      const subtopicsFormatted = topic.subtopics.map((subtopic: any) => ({
        id: subtopic.id,
        topicId: subtopic.topicId,
        slug: subtopic.slug,
        name: subtopic.name,
        estimatedMinutes: subtopic.estimatedMinutes,
        sortOrder: subtopic.sortOrder,
        items: subtopic.items.map(formatItem),
      }));

      const directItemsFormatted = topic.items.filter((it: any) => it.subtopicId === null).map(formatItem);
      const allTopicQuestions = [...directItemsFormatted, ...subtopicsFormatted.flatMap((s: any) => s.items)];
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

    return {
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
    };
  }

  /**
   * Get topic questions by topicId or subject/topic slugs
   */
  static async getTopicQuestions(
    params: { topicId?: string; slug?: string; topicSlug?: string },
    userId?: string
  ): Promise<TopicQuestionsResponseDto> {
    const { topicId, slug, topicSlug } = params;
    const now = new Date();

    const topic = topicId && !isNaN(Number(topicId))
      ? await RoadmapRepository.findTopicById(Number(topicId))
      : slug && topicSlug
      ? await RoadmapRepository.findTopicBySubjectAndSlug(slug, topicSlug)
      : null;

    if (!topic) {
      throw new NotFoundError("Topic not found");
    }

    const progressMap = new Map<number, any>();
    if (userId) {
      const userProgressList = await RoadmapRepository.findUserProgressForItems(
        userId,
        topic.items.map((it: any) => it.id)
      );
      for (const p of userProgressList) {
        progressMap.set(p.itemId, p);
      }
    }

    const formattedQuestions: RoadmapItemDto[] = topic.items.map((item: any) => {
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

    return {
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
    };
  }

  /**
   * Record question solve and calculate next revision
   */
  static async solveQuestion(
    itemId: number,
    isCorrect: boolean,
    notes: string | undefined,
    userId: string
  ): Promise<{ progress: UserItemProgressDto; message: string }> {
    const item = await RoadmapRepository.findItemById(itemId);
    if (!item) {
      throw new NotFoundError(`Question/Item #${itemId} not found`);
    }

    const existingProgress = await RoadmapRepository.findSingleUserProgress(userId, itemId);
    const currentSolveCount = existingProgress?.solveCount ?? 0;
    const now = new Date();

    const calculation = calculateNextRevision(currentSolveCount, Boolean(isCorrect), now);

    const updatedProgress = await RoadmapRepository.upsertUserProgress(userId, itemId, {
      status: calculation.status,
      solveCount: calculation.solveCount,
      lastSolvedAt: calculation.lastSolvedAt,
      nextRevisionAt: calculation.nextRevisionAt,
      lastScore: calculation.lastScore,
      notes: notes !== undefined ? notes : existingProgress?.notes,
      completedAt: isCorrect ? now : existingProgress?.completedAt ?? null,
    });

    const formattedRevision = formatRevisionStatus(
      updatedProgress.nextRevisionAt,
      updatedProgress.solveCount,
      now
    );

    return {
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
    };
  }

  /**
   * Get single item user progress
   */
  static async getItemProgress(itemId: number, userId: string): Promise<UserItemProgressDto | null> {
    const progress = await RoadmapRepository.findSingleUserProgress(userId, itemId);
    if (!progress) return null;

    const now = new Date();
    const statusInfo = formatRevisionStatus(progress.nextRevisionAt, progress.solveCount, now);

    return {
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
    };
  }

  /**
   * Get user revision items (due and upcoming)
   */
  static async getUserRevisionItems(userId: string | null): Promise<UserRevisionListDto> {
    if (!userId) {
      return { dueCount: 0, totalCount: 0, items: [] };
    }

    const now = new Date();
    const progressRecords = await RoadmapRepository.findUserRevisionProgress(userId);

    const items: UserRevisionItemDto[] = progressRecords.map((p: any) => {
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

    items.sort((a, b) => {
      if (a.progress.isDue && !b.progress.isDue) return -1;
      if (!a.progress.isDue && b.progress.isDue) return 1;
      const dateA = a.progress.nextRevisionAt ? new Date(a.progress.nextRevisionAt).getTime() : Infinity;
      const dateB = b.progress.nextRevisionAt ? new Date(b.progress.nextRevisionAt).getTime() : Infinity;
      return dateA - dateB;
    });

    return {
      dueCount: items.filter((it) => it.progress.isDue).length,
      totalCount: items.length,
      items,
    };
  }

  /**
   * Create new Roadmap / Curriculum Item
   */
  static async createRoadmapItem(input: CreateRoadmapItemInput) {
    const { title, subjectId, topicId, subtopicId, difficulty, estimatedMinutes, type } = input;

    const subject = await RoadmapRepository.findSubjectById(subjectId);
    if (!subject) throw new NotFoundError(`Subject ID ${subjectId} not found`);

    const topic = await RoadmapRepository.findTopicById(topicId);
    if (!topic || topic.subjectId !== subjectId) {
      throw new BadRequestError(`Topic ID ${topicId} does not belong to Subject ID ${subjectId}`);
    }

    if (subtopicId) {
      const subtopic = await RoadmapRepository.findSubtopicById(subtopicId);
      if (!subtopic || subtopic.topicId !== topicId) {
        throw new BadRequestError(`Subtopic ID ${subtopicId} does not belong to Topic ID ${topicId}`);
      }
    }

    const nextItemNo = await RoadmapRepository.getMaxItemNo();
    const nextSortOrder = await RoadmapRepository.getMaxSortOrderForTopic(topicId);

    let baseSlug = title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    if (!baseSlug) baseSlug = `question-${nextItemNo}`;

    let uniqueSlug = baseSlug;
    const existing = await RoadmapRepository.findItemWithSlugInTopic(topicId, uniqueSlug);
    if (existing) {
      uniqueSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
    }

    return RoadmapRepository.createRoadmapItem({
      title: title.trim(),
      slug: uniqueSlug,
      subjectId,
      topicId,
      subtopicId: subtopicId ?? null,
      itemNo: nextItemNo,
      sortOrder: nextSortOrder,
      difficulty: difficulty || "Medium",
      estimatedMinutes: estimatedMinutes || 15,
      type: type || "Problem",
    });
  }

  static async getRoadmapSummary() {
    return RoadmapRepository.getRoadmapSummaryView();
  }
}
