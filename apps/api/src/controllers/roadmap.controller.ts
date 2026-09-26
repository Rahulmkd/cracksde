import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

/**
 * Get all roadmap subjects with topic/item counts and summary stats
 */
export async function getRoadmapSubjects(req: Request, res: Response): Promise<void> {
  try {
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

    const formattedSubjects = subjects.map((subject) => {
      let subtopicCount = 0;
      for (const t of subject.topics) {
        subtopicCount += t._count.subtopics;
      }

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
 * Get a specific roadmap subject by slug with full nested hierarchy
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
              where: { subtopicId: null },
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
        topics: subject.topics.map((topic) => ({
          id: topic.id,
          subjectId: topic.subjectId,
          slug: topic.slug,
          name: topic.name,
          estimatedMinutes: topic.estimatedMinutes,
          sortOrder: topic.sortOrder,
          subtopics: topic.subtopics.map((subtopic) => ({
            id: subtopic.id,
            topicId: subtopic.topicId,
            slug: subtopic.slug,
            name: subtopic.name,
            estimatedMinutes: subtopic.estimatedMinutes,
            sortOrder: subtopic.sortOrder,
            items: subtopic.items.map((item) => ({
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
            })),
          })),
          items: topic.items.map((item) => ({
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
          })),
        })),
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
