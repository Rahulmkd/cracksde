import { prisma } from "../../lib/prisma.js";
import { StudyPlanRepository } from "./study-plan.repository.js";
import {
  calculateNextRevision,
  formatRevisionStatus,
} from "../repetition/repetition.service.js";
import { NotFoundError } from "../../shared/errors/app-error.js";
import type {
  StudyPlanDto,
  UpdateTaskDto,
  UpdateStudyPlanDto,
  StudyTaskDto,
  StudySprintDto,
  StudyDayDto,
} from "@cracksde/shared";

export class StudyPlanService {
  static async getStudyPlan(slug: string = "crack-sde", userId?: string): Promise<StudyPlanDto> {
    const plan = await StudyPlanRepository.findPlanBySlug(slug);
    if (!plan) {
      throw new NotFoundError(`Study plan '${slug}' not found`);
    }

    const userProgressMap = new Map<number, any>();
    if (userId) {
      const userProgressRecords = await StudyPlanRepository.findUserProgressForUser(userId);
      for (const p of userProgressRecords) {
        userProgressMap.set(p.itemId, p);
      }
    }

    const now = new Date();
    let totalPlanTasks = 0;
    let completedPlanTasks = 0;
    let totalPlanMinutes = 0;
    let completedPlanMinutes = 0;
    let totalPlanDays = 0;
    let completedPlanDays = 0;

    const formattedSprints: StudySprintDto[] = plan.sprints.map((sprint: any) => {
      let sprintEstimatedMinutes = 0;
      let sprintActualMinutes = 0;
      let sprintDaysTotal = 0;
      let sprintDaysCompleted = 0;

      const formattedDays: StudyDayDto[] = sprint.days.map((day: any) => {
        totalPlanDays++;
        sprintDaysTotal++;

        let dayTasksTotal = day.tasks.length;
        let dayTasksCompleted = 0;
        let dayEstimatedMinutes = 0;

        const formattedTasks: StudyTaskDto[] = day.tasks.map((task: any) => {
          totalPlanTasks++;
          const taskEstMin = task.estimatedMinutes || 0;
          dayEstimatedMinutes += taskEstMin;
          totalPlanMinutes += taskEstMin;

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
            : { text: "Not Solved Yet", isDue: false, code: "not_started" as const };

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
      const anySprintTaskDone = formattedDays.some((d: StudyDayDto) => d.tasksCompleted > 0);
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

    const completedSprintsCount = formattedSprints.filter((s: StudySprintDto) => s.status === "completed").length;
    const progressPercent = totalPlanTasks > 0 ? Math.round((completedPlanTasks / totalPlanTasks) * 100) : 0;

    const firstSprint = formattedSprints[0];
    const lastSprint = formattedSprints[formattedSprints.length - 1];
    const startDate = firstSprint?.plannedStartDate || (plan.createdAt ? plan.createdAt.toISOString() : null);
    const targetDate = lastSprint?.plannedEndDate || null;

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

    return {
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
    };
  }

  static async updateStudyTask(taskId: bigint, updates: UpdateTaskDto, userId?: string) {
    const updateData: Record<string, unknown> = {};
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.isRevision !== undefined) updateData.isRevision = updates.isRevision;
    if (updates.actualMinutes !== undefined) updateData.actualMinutes = updates.actualMinutes;

    const updatedTask = await StudyPlanRepository.updateTask(taskId, updateData);

    if (userId && updatedTask.itemId) {
      if (updates.status === "completed") {
        const existingProgress = await prisma.userItemProgress.findUnique({
          where: {
            uq_user_roadmap_item_progress: {
              userId,
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
              userId,
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
            userId,
            itemId: updatedTask.itemId,
            status: calculation.status,
            solveCount: calculation.solveCount,
            lastSolvedAt: calculation.lastSolvedAt,
            nextRevisionAt: calculation.nextRevisionAt,
            lastScore: calculation.lastScore,
            completedAt: now,
          },
        });
      } else if (updates.status === "not_started") {
        const existingProgress = await prisma.userItemProgress.findUnique({
          where: {
            uq_user_roadmap_item_progress: {
              userId,
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

    if (updates.status !== undefined) {
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

      const allSprintDays = await prisma.studyDay.findMany({
        where: { sprintId: updatedTask.sprintId },
      });
      const allDaysCompleted = allSprintDays.every((d: any) =>
        d.dayId === updatedTask.dayId ? dayStatus === "completed" : d.status === "completed"
      );
      const anyDayInProgress = allSprintDays.some((d: any) =>
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

    return {
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
    };
  }

  static async updateStudyPlan(slug: string, updates: UpdateStudyPlanDto) {
    const updatedPlan = await StudyPlanRepository.updateStudyPlan(slug, {
      ...(updates.name ? { name: updates.name } : {}),
    });

    if (updates.startDate) {
      const start = new Date(updates.startDate);
      if (!isNaN(start.getTime())) {
        const days = await StudyPlanRepository.findDaysForPlan(updatedPlan.id);

        for (const day of days) {
          const dayDate = new Date(start);
          dayDate.setDate(start.getDate() + (day.planDayNo - 1));
          await StudyPlanRepository.updateDayDate(day.dayId, dayDate);
        }

        for (const sprint of updatedPlan.sprints) {
          const sprintDays = await StudyPlanRepository.findDaysForSprint(sprint.sprintId);
          if (sprintDays.length > 0) {
            const firstDate = sprintDays[0].calendarDate;
            const lastDate = sprintDays[sprintDays.length - 1].calendarDate;
            await StudyPlanRepository.updateSprintDates(sprint.sprintId, firstDate, lastDate);
          }
        }
      }
    }

    return {
      id: updatedPlan.id,
      slug: updatedPlan.slug,
      name: updatedPlan.name,
    };
  }

  static async getRevisionList(userId?: string) {
    const now = new Date();
    const tasks = await StudyPlanRepository.findRevisionTasks();

    const progressMap = new Map<number, any>();
    if (userId) {
      const userProgressRecords = await StudyPlanRepository.findUserProgressForUser(userId);
      for (const p of userProgressRecords) {
        progressMap.set(p.itemId, p);
      }
    }

    return tasks.map((task: any) => {
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
  }
}
