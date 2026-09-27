import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { getAuthenticatedUser } from "../lib/auth-helper.js";
import {
  calculateNextRevision,
  formatRevisionStatus,
} from "../services/spaced-repetition.service.js";

/**
 * Get study plan details with sprints, days, linked roadmap items, and user-scoped progress
 */
export async function getStudyPlan(req: Request, res: Response): Promise<void> {
  const rawSlug = req.params.slug || "crack-sde";
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;

  try {
    const user = await getAuthenticatedUser(req);

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

    // Load progress for all items for authenticated user
    const userProgressMap = new Map<number, {
      status: string;
      solveCount: number;
      lastSolvedAt: Date | null;
      nextRevisionAt: Date | null;
      lastScore: boolean | null;
      notes: string | null;
      completedAt: Date | null;
    }>();

    if (user) {
      const userProgressRecords = await prisma.userItemProgress.findMany({
        where: { userId: user.id },
      });

      for (const p of userProgressRecords) {
        userProgressMap.set(p.itemId, {
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

    const now = new Date();
    let totalPlanTasks = 0;
    let completedPlanTasks = 0;
    let totalPlanMinutes = 0;
    let completedPlanMinutes = 0;
    let totalPlanDays = 0;
    let completedPlanDays = 0;

    const formattedSprints = plan.sprints.map((sprint) => {
      let sprintEstimatedMinutes = 0;
      let sprintActualMinutes = 0;
      let sprintDaysTotal = 0;
      let sprintDaysCompleted = 0;

      const formattedDays = sprint.days.map((day) => {
        totalPlanDays++;
        sprintDaysTotal++;

        let dayTasksTotal = day.tasks.length;
        let dayTasksCompleted = 0;
        let dayEstimatedMinutes = 0;

        const formattedTasks = day.tasks.map((task) => {
          totalPlanTasks++;
          const taskEstMin = task.estimatedMinutes || 0;
          dayEstimatedMinutes += taskEstMin;
          totalPlanMinutes += taskEstMin;

          // Determine completion status: either marked on task or in userItemProgress
          let isCompleted = task.status === "completed";
          let userProg = task.itemId ? userProgressMap.get(task.itemId) : undefined;

          if (userProg && (userProg.status === "completed" || userProg.solveCount > 0)) {
            isCompleted = true;
          }

          if (isCompleted) {
            dayTasksCompleted++;
            completedPlanTasks++;
            completedPlanMinutes += taskEstMin;
            sprintActualMinutes += task.actualMinutes || taskEstMin;
          }

          const statusInfo = userProg
            ? formatRevisionStatus(userProg.nextRevisionAt, userProg.solveCount, now)
            : { text: "Not Solved Yet", isDue: false };

          return {
            taskId: task.taskId.toString(),
            dayId: task.dayId.toString(),
            sprintId: task.sprintId.toString(),
            itemId: task.itemId,
            taskOrder: task.taskOrder,
            status: isCompleted ? "completed" : "not_started",
            estimatedMinutes: taskEstMin,
            actualMinutes: task.actualMinutes || 0,
            isCarriedForward: task.isCarriedForward || false,
            isBacklog: task.isBacklog || false,
            isRevision: task.isRevision || Boolean(userProg && userProg.status === "needs_revision"),
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
                  progress: userProg
                    ? {
                        itemId: task.item.id,
                        status: userProg.status,
                        solveCount: userProg.solveCount,
                        lastSolvedAt: userProg.lastSolvedAt?.toISOString() ?? null,
                        nextRevisionAt: userProg.nextRevisionAt?.toISOString() ?? null,
                        lastScore: userProg.lastScore,
                        notes: userProg.notes,
                        completedAt: userProg.completedAt?.toISOString() ?? null,
                        revisionStatusText: statusInfo.text,
                        isDue: statusInfo.isDue,
                      }
                    : null,
                }
              : null,
          };
        });

        const isDayComplete = dayTasksTotal > 0 && dayTasksCompleted >= dayTasksTotal;
        if (isDayComplete) {
          completedPlanDays++;
          sprintDaysCompleted++;
        }

        const dayStatus = isDayComplete
          ? "completed"
          : dayTasksCompleted > 0
          ? "in_progress"
          : "upcoming";

        sprintEstimatedMinutes += dayEstimatedMinutes;

        return {
          dayId: day.dayId.toString(),
          sprintId: day.sprintId.toString(),
          planDayNo: day.planDayNo,
          sprintDayNo: day.sprintDayNo,
          calendarDate: day.calendarDate ? day.calendarDate.toISOString() : null,
          status: dayStatus,
          estimatedMinutes: dayEstimatedMinutes || day.estimatedMinutes || 0,
          actualMinutes: day.actualMinutes || 0,
          tasksTotal: dayTasksTotal,
          tasksCompleted: dayTasksCompleted,
          isCatchUpDay: day.isCatchUpDay || false,
          tasks: formattedTasks,
        };
      });

      const isSprintComplete = sprintDaysTotal > 0 && sprintDaysCompleted >= sprintDaysTotal;
      const anySprintTaskDone = formattedDays.some((d) => d.tasksCompleted > 0);
      const sprintStatus = isSprintComplete
        ? "completed"
        : anySprintTaskDone
        ? "in_progress"
        : "upcoming";

      return {
        sprintId: sprint.sprintId.toString(),
        planId: sprint.planId,
        sprintNo: sprint.sprintNo,
        status: sprintStatus,
        plannedStartDate: sprint.plannedStartDate ? sprint.plannedStartDate.toISOString() : null,
        plannedEndDate: sprint.plannedEndDate ? sprint.plannedEndDate.toISOString() : null,
        initialDaysAssigned: sprint.initialDaysAssigned || sprint.days.length,
        actualDaysTaken: sprint.actualDaysTaken || 0,
        totalEstimatedMinutes: sprintEstimatedMinutes || sprint.totalEstimatedMinutes || 0,
        totalActualMinutes: sprintActualMinutes,
        days: formattedDays,
      };
    });

    const completedSprintsCount = formattedSprints.filter((s) => s.status === "completed").length;
    const progressPercent = totalPlanTasks > 0 ? Math.round((completedPlanTasks / totalPlanTasks) * 100) : 0;

    // Date range calculations
    const firstSprint = formattedSprints[0];
    const lastSprint = formattedSprints[formattedSprints.length - 1];
    const startDate = firstSprint?.plannedStartDate || (plan.createdAt ? plan.createdAt.toISOString() : null);
    const targetDate = lastSprint?.plannedEndDate || null;

    // Schedule on-track analysis
    let isOnSchedule = true;
    let scheduleStatusText = "On Schedule";

    if (startDate) {
      const start = new Date(startDate);
      const elapsedDays = Math.max(0, Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
      if (elapsedDays > 0 && totalPlanDays > 0) {
        const expectedCompletedDays = Math.min(totalPlanDays, elapsedDays);
        if (completedPlanDays < expectedCompletedDays - 1) {
          isOnSchedule = false;
          scheduleStatusText = "Behind Schedule";
        }
      }
    }

    res.json({
      success: true,
      data: {
        id: plan.id,
        slug: plan.slug,
        name: plan.name,
        sourceUrl: plan.sourceUrl,
        role: "Software Engineer",
        dailyHours: 4,
        startDate,
        targetDate,
        totalDays: totalPlanDays,
        completedDays: completedPlanDays,
        totalTasks: totalPlanTasks,
        completedTasks: completedPlanTasks,
        progressPercent,
        totalEstimatedMinutes: totalPlanMinutes,
        completedEstimatedMinutes: completedPlanMinutes,
        completedSprints: completedSprintsCount,
        isOnSchedule,
        scheduleStatusText,
        sprints: formattedSprints,
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
 * Synchronizes with userItemProgress and spaced repetition engine
 */
export async function updateStudyTask(req: Request, res: Response): Promise<void> {
  const rawTaskId = req.params.taskId;
  const taskIdStr = Array.isArray(rawTaskId) ? rawTaskId[0] : rawTaskId;
  const { status, isRevision, actualMinutes } = req.body;

  try {
    const user = await getAuthenticatedUser(req);
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

    // If user is authenticated, synchronize with userItemProgress & spaced repetition
    if (user && updatedTask.itemId) {
      if (status === "completed") {
        const existingProgress = await prisma.userItemProgress.findUnique({
          where: {
            uq_user_roadmap_item_progress: {
              userId: user.id,
              itemId: updatedTask.itemId,
            },
          },
        });

        const currentSolveCount = existingProgress?.solveCount ?? 0;
        const now = new Date();
        const calculation = calculateNextRevision(currentSolveCount, true, now);

        await prisma.userItemProgress.upsert({
          where: {
            uq_user_roadmap_item_progress: {
              userId: user.id,
              itemId: updatedTask.itemId,
            },
          },
          update: {
            status: calculation.status,
            solveCount: calculation.solveCount,
            lastSolvedAt: calculation.lastSolvedAt,
            nextRevisionAt: calculation.nextRevisionAt,
            lastScore: calculation.lastScore,
            completedAt: now,
          },
          create: {
            userId: user.id,
            itemId: updatedTask.itemId,
            status: calculation.status,
            solveCount: calculation.solveCount,
            lastSolvedAt: calculation.lastSolvedAt,
            nextRevisionAt: calculation.nextRevisionAt,
            lastScore: calculation.lastScore,
            completedAt: now,
          },
        });
      } else if (status === "not_started") {
        const existingProgress = await prisma.userItemProgress.findUnique({
          where: {
            uq_user_roadmap_item_progress: {
              userId: user.id,
              itemId: updatedTask.itemId,
            },
          },
        });

        if (existingProgress) {
          await prisma.userItemProgress.update({
            where: { id: existingProgress.id },
            data: {
              status: "not_started",
              completedAt: null,
              solveCount: Math.max(0, existingProgress.solveCount - 1),
            },
          });
        }
      }
    }

    // Update day completed tasks count & day status
    if (status !== undefined) {
      const completedCount = await prisma.studyTask.count({
        where: {
          dayId: updatedTask.dayId,
          status: "completed",
        },
      });
      const totalCount = await prisma.studyTask.count({
        where: { dayId: updatedTask.dayId },
      });

      const dayStatus = completedCount >= totalCount && totalCount > 0
        ? "completed"
        : completedCount > 0
        ? "in_progress"
        : "upcoming";

      await prisma.studyDay.update({
        where: { dayId: updatedTask.dayId },
        data: {
          tasksCompleted: completedCount,
          status: dayStatus,
        },
      });

      // Update parent sprint status
      const allSprintDays = await prisma.studyDay.findMany({
        where: { sprintId: updatedTask.sprintId },
      });
      const allDaysCompleted = allSprintDays.every((d) =>
        d.dayId === updatedTask.dayId ? dayStatus === "completed" : d.status === "completed"
      );
      const anyDayInProgress = allSprintDays.some((d) =>
        d.dayId === updatedTask.dayId ? completedCount > 0 : (d.tasksCompleted || 0) > 0
      );
      const sprintStatus = allDaysCompleted
        ? "completed"
        : anyDayInProgress
        ? "in_progress"
        : "upcoming";

      await prisma.studySprint.update({
        where: { sprintId: updatedTask.sprintId },
        data: { status: sprintStatus },
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
 * Update study plan metadata (name, start dates, daily hours)
 * Recalculates all calendar dates and sprint ranges
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
      include: {
        sprints: {
          orderBy: { sprintNo: "asc" },
        },
      },
    });

    if (startDate) {
      const start = new Date(startDate);
      if (!isNaN(start.getTime())) {
        const days = await prisma.studyDay.findMany({
          where: { sprint: { planId: updatedPlan.id } },
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

        // Recalculate sprint plannedStartDate & plannedEndDate
        for (const sprint of updatedPlan.sprints) {
          const sprintDays = await prisma.studyDay.findMany({
            where: { sprintId: sprint.sprintId },
            orderBy: { sprintDayNo: "asc" },
          });

          if (sprintDays.length > 0) {
            const firstDate = sprintDays[0].calendarDate;
            const lastDate = sprintDays[sprintDays.length - 1].calendarDate;
            await prisma.studySprint.update({
              where: { sprintId: sprint.sprintId },
              data: {
                plannedStartDate: firstDate,
                plannedEndDate: lastDate,
              },
            });
          }
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
 * Get Revision List (all tasks marked as isRevision = true, plus user spaced repetition items)
 */
export async function getRevisionList(req: Request, res: Response): Promise<void> {
  try {
    const user = await getAuthenticatedUser(req);
    const now = new Date();

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

    // If user is authenticated, also fetch user's spaced repetition revision progress
    const progressMap = new Map<number, {
      status: string;
      solveCount: number;
      lastSolvedAt: Date | null;
      nextRevisionAt: Date | null;
      lastScore: boolean | null;
    }>();

    if (user) {
      const userProgressRecords = await prisma.userItemProgress.findMany({
        where: { userId: user.id },
      });
      for (const p of userProgressRecords) {
        progressMap.set(p.itemId, p);
      }
    }

    const formattedTasks = tasks.map((task) => {
      const p = task.itemId ? progressMap.get(task.itemId) : undefined;
      const statusInfo = formatRevisionStatus(p?.nextRevisionAt ?? null, p?.solveCount ?? 0, now);

      return {
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
              progress: p
                ? {
                    itemId: task.item.id,
                    status: p.status,
                    solveCount: p.solveCount,
                    lastSolvedAt: p.lastSolvedAt?.toISOString() ?? null,
                    nextRevisionAt: p.nextRevisionAt?.toISOString() ?? null,
                    lastScore: p.lastScore,
                    revisionStatusText: statusInfo.text,
                    isDue: statusInfo.isDue,
                  }
                : null,
            }
          : null,
      };
    });

    res.json({
      success: true,
      data: formattedTasks,
    });
  } catch (error) {
    console.error("Error fetching revision list:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch revision list",
    });
  }
}
