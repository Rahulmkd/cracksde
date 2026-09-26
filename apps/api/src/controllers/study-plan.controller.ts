import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

/**
 * Get study plan details with sprints, days, and linked roadmap items
 */
export async function getStudyPlan(req: Request, res: Response): Promise<void> {
  const rawSlug = req.params.slug || "crack-sde";
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;

  try {
    const plan = await prisma.studyPlan.findUnique({
      where: { slug },
      include: {
        sprints: {
          orderBy: { sprintNo: "asc" },
          include: {
            days: {
              orderBy: { sprintDayNo: "asc" },
              include: {
                tasks: {
                  orderBy: { taskOrder: "asc" },
                  include: {
                    item: {
                      include: {
                        subject: { select: { slug: true, name: true } },
                        topic: { select: { slug: true, name: true } },
                        subtopic: { select: { slug: true, name: true } },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!plan) {
      res.status(404).json({
        success: false,
        error: `Study plan '${slug}' not found`,
      });
      return;
    }

    res.json({
      success: true,
      data: {
        id: plan.id,
        slug: plan.slug,
        name: plan.name,
        sourceUrl: plan.sourceUrl,
        sprints: plan.sprints.map((sprint) => ({
          sprintId: sprint.sprintId.toString(),
          planId: sprint.planId,
          sprintNo: sprint.sprintNo,
          status: sprint.status,
          plannedStartDate: sprint.plannedStartDate,
          plannedEndDate: sprint.plannedEndDate,
          initialDaysAssigned: sprint.initialDaysAssigned,
          actualDaysTaken: sprint.actualDaysTaken,
          totalEstimatedMinutes: sprint.totalEstimatedMinutes,
          totalActualMinutes: sprint.totalActualMinutes,
          days: sprint.days.map((day) => ({
            dayId: day.dayId.toString(),
            sprintId: day.sprintId.toString(),
            planDayNo: day.planDayNo,
            sprintDayNo: day.sprintDayNo,
            calendarDate: day.calendarDate,
            status: day.status,
            estimatedMinutes: day.estimatedMinutes,
            actualMinutes: day.actualMinutes,
            tasksTotal: day.tasksTotal,
            tasksCompleted: day.tasksCompleted,
            isCatchUpDay: day.isCatchUpDay,
            tasks: day.tasks.map((task) => ({
              taskId: task.taskId.toString(),
              dayId: task.dayId.toString(),
              sprintId: task.sprintId.toString(),
              itemId: task.itemId,
              taskOrder: task.taskOrder,
              status: task.status,
              estimatedMinutes: task.estimatedMinutes,
              actualMinutes: task.actualMinutes,
              isCarriedForward: task.isCarriedForward,
              isBacklog: task.isBacklog,
              isRevision: task.isRevision,
              item: task.item
                ? {
                    id: task.item.id,
                    title: task.item.title,
                    slug: task.item.slug,
                    type: task.item.type,
                    difficulty: task.item.difficulty,
                    subjectSlug: task.item.subject.slug,
                    subjectName: task.item.subject.name,
                    topicName: task.item.topic.name,
                    subtopicName: task.item.subtopic?.name ?? null,
                  }
                : null,
            })),
          })),
        })),
      },
    });
  } catch (error) {
    console.error(`Error fetching study plan '${slug}':`, error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch study plan",
    });
  }
}

/**
 * Update a specific task (status, isRevision, actualMinutes)
 */
export async function updateStudyTask(req: Request, res: Response): Promise<void> {
  const rawTaskId = req.params.taskId;
  const taskIdStr = Array.isArray(rawTaskId) ? rawTaskId[0] : rawTaskId;
  const { status, isRevision, actualMinutes } = req.body;

  try {
    const parsedTaskId = BigInt(taskIdStr);

    const updateData: Record<string, unknown> = {};
    if (status !== undefined) updateData.status = status;
    if (isRevision !== undefined) updateData.isRevision = isRevision;
    if (actualMinutes !== undefined) updateData.actualMinutes = actualMinutes;

    const updatedTask = await prisma.studyTask.update({
      where: { taskId: parsedTaskId },
      data: updateData,
      include: {
        item: {
          include: {
            subject: { select: { slug: true, name: true } },
            topic: { select: { slug: true, name: true } },
            subtopic: { select: { slug: true, name: true } },
          },
        },
      },
    });

    // Update day completed tasks count
    if (status !== undefined) {
      const completedCount = await prisma.studyTask.count({
        where: {
          dayId: updatedTask.dayId,
          status: "completed",
        },
      });
      await prisma.studyDay.update({
        where: { dayId: updatedTask.dayId },
        data: { tasksCompleted: completedCount },
      });
    }

    res.json({
      success: true,
      data: {
        taskId: updatedTask.taskId.toString(),
        dayId: updatedTask.dayId.toString(),
        sprintId: updatedTask.sprintId.toString(),
        itemId: updatedTask.itemId,
        taskOrder: updatedTask.taskOrder,
        status: updatedTask.status,
        estimatedMinutes: updatedTask.estimatedMinutes,
        actualMinutes: updatedTask.actualMinutes,
        isCarriedForward: updatedTask.isCarriedForward,
        isBacklog: updatedTask.isBacklog,
        isRevision: updatedTask.isRevision,
        item: updatedTask.item
          ? {
              id: updatedTask.item.id,
              title: updatedTask.item.title,
              slug: updatedTask.item.slug,
              type: updatedTask.item.type,
              difficulty: updatedTask.item.difficulty,
              subjectSlug: updatedTask.item.subject.slug,
              subjectName: updatedTask.item.subject.name,
              topicName: updatedTask.item.topic.name,
              subtopicName: updatedTask.item.subtopic?.name ?? null,
            }
          : null,
      },
    });
  } catch (error) {
    console.error(`Error updating task '${taskIdStr}':`, error);
    res.status(500).json({
      success: false,
      error: "Failed to update task",
    });
  }
}

/**
 * Update study plan metadata (name, start dates)
 */
export async function updateStudyPlan(req: Request, res: Response): Promise<void> {
  const rawSlug = req.params.slug || "crack-sde";
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;
  const { name, startDate } = req.body;

  try {
    const updatedPlan = await prisma.studyPlan.update({
      where: { slug },
      data: {
        ...(name ? { name } : {}),
      },
    });

    if (startDate) {
      const start = new Date(startDate);
      if (!isNaN(start.getTime())) {
        const days = await prisma.studyDay.findMany({
          orderBy: { planDayNo: "asc" },
        });

        for (const day of days) {
          const dayDate = new Date(start);
          dayDate.setDate(start.getDate() + (day.planDayNo - 1));
          await prisma.studyDay.update({
            where: { dayId: day.dayId },
            data: { calendarDate: dayDate },
          });
        }
      }
    }

    res.json({
      success: true,
      data: {
        id: updatedPlan.id,
        slug: updatedPlan.slug,
        name: updatedPlan.name,
      },
    });
  } catch (error) {
    console.error(`Error updating study plan '${slug}':`, error);
    res.status(500).json({
      success: false,
      error: "Failed to update study plan",
    });
  }
}

/**
 * Get Revision List (all tasks marked as isRevision = true)
 */
export async function getRevisionList(req: Request, res: Response): Promise<void> {
  try {
    const tasks = await prisma.studyTask.findMany({
      where: { isRevision: true },
      include: {
        item: {
          include: {
            subject: { select: { slug: true, name: true } },
            topic: { select: { slug: true, name: true } },
            subtopic: { select: { slug: true, name: true } },
          },
        },
      },
      orderBy: { taskOrder: "asc" },
    });

    res.json({
      success: true,
      data: tasks.map((task) => ({
        taskId: task.taskId.toString(),
        dayId: task.dayId.toString(),
        sprintId: task.sprintId.toString(),
        itemId: task.itemId,
        taskOrder: task.taskOrder,
        status: task.status,
        estimatedMinutes: task.estimatedMinutes,
        actualMinutes: task.actualMinutes,
        isCarriedForward: task.isCarriedForward,
        isBacklog: task.isBacklog,
        isRevision: task.isRevision,
        item: task.item
          ? {
              id: task.item.id,
              title: task.item.title,
              slug: task.item.slug,
              type: task.item.type,
              difficulty: task.item.difficulty,
              subjectSlug: task.item.subject.slug,
              subjectName: task.item.subject.name,
              topicName: task.item.topic.name,
              subtopicName: task.item.subtopic?.name ?? null,
            }
          : null,
      })),
    });
  } catch (error) {
    console.error("Error fetching revision list:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch revision list",
    });
  }
}
