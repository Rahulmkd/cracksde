import { StudyPlanRepository } from "./study-plan.repository.js";
import {
  calculateNextRevision,
  formatRevisionStatus,
} from "../repetition/repetition.service.js";
import { NotFoundError, UnauthorizedError } from "../../shared/errors/app-error.js";
import type {
  StudyPlanDto,
  UpdateTaskDto,
  UpdateStudyPlanDto,
  StudyTaskDto,
  StudySprintDto,
  StudyDayDto,
} from "@cracksde/shared";

export class StudyPlanService {
  /**
   * Fetch a study plan tailored strictly to the authenticated user's progress.
   * If userId is absent or user has no progress, all tasks default to uncompleted.
   */
  static async getStudyPlan(slug: string = "crack-sde", userId?: string): Promise<StudyPlanDto> {
    const plan = await StudyPlanRepository.findPlanBySlug(slug);
    if (!plan) {
      throw new NotFoundError(`Study plan '${slug}' not found`);
    }

    const userProgressMap = new Map<number, any>();
    let userProfile: any = null;
    if (userId) {
      const userProgressRecords = await StudyPlanRepository.findUserProgressForUser(userId);
      for (const p of userProgressRecords) {
        userProgressMap.set(p.itemId, p);
      }
      userProfile = await StudyPlanRepository.findUserProfile(userId);
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

        const dayTasksTotal = day.tasks.length;
        let dayTasksCompleted = 0;
        let dayEstimatedMinutes = 0;

        const formattedTasks: StudyTaskDto[] = day.tasks.map((task: any) => {
          totalPlanTasks++;
          const taskEstMin = task.estimatedMinutes || 20;
          dayEstimatedMinutes += taskEstMin;
          totalPlanMinutes += taskEstMin;

          // STRICT USER ISOLATION: A task is ONLY completed if the current user has completed it.
          const userProg = task.itemId ? userProgressMap.get(task.itemId) : undefined;
          const isCompleted = Boolean(
            userProg &&
              (userProg.status === "completed" ||
                (userProg.solveCount > 0 && userProg.lastScore !== false))
          );

          if (isCompleted) {
            dayTasksCompleted++;
            completedPlanTasks++;
            completedPlanMinutes += taskEstMin;
            sprintActualMinutes += taskEstMin;
          }

          const isRevision = Boolean(
            userProg &&
              (userProg.status === "needs_revision" ||
                (userProg.nextRevisionAt && new Date(userProg.nextRevisionAt) <= now))
          );

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
            actualMinutes: isCompleted ? taskEstMin : 0,
            isCarriedForward: task.isCarriedForward || false,
            isBacklog: task.isBacklog || false,
            isRevision,
            item: task.item
              ? {
                  id: task.item.id,
                  title: task.item.title,
                  slug: task.item.slug,
                  type: task.item.type,
                  difficulty: task.item.difficulty,
                  subjectSlug: task.item.subject?.slug || "",
                  subjectName: task.item.subject?.name || "",
                  topicName: task.item.topic?.name || "",
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
          estimatedMinutes: dayEstimatedMinutes,
          actualMinutes: isDayComplete ? dayEstimatedMinutes : 0,
          tasksTotal: dayTasksTotal,
          tasksCompleted: dayTasksCompleted,
          isCatchUpDay: day.isCatchUpDay || false,
          tasks: formattedTasks,
        };
      });

      const isSprintComplete = sprintDaysTotal > 0 && sprintDaysCompleted >= sprintDaysTotal;
      const anySprintTaskDone = formattedDays.some((d: StudyDayDto) => (d.tasksCompleted || 0) > 0);
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
        totalEstimatedMinutes: sprintEstimatedMinutes,
        totalActualMinutes: sprintActualMinutes,
        days: formattedDays,
      };
    });

    const completedSprintsCount = formattedSprints.filter(
      (s: StudySprintDto) => s.status === "completed"
    ).length;
    const progressPercent =
      totalPlanTasks > 0 ? Math.round((completedPlanTasks / totalPlanTasks) * 100) : 0;

    const firstSprint = formattedSprints[0];
    const lastSprint = formattedSprints[formattedSprints.length - 1];
    const startDate =
      firstSprint?.plannedStartDate || (plan.createdAt ? plan.createdAt.toISOString() : null);
    const targetDate = lastSprint?.plannedEndDate || null;

    let isOnSchedule = true;
    let scheduleStatusText = "On Schedule";

    if (startDate) {
      const start = new Date(startDate);
      const elapsedDays = Math.max(
        0,
        Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
      );
      if (elapsedDays > 0 && totalPlanDays > 0) {
        const expectedCompletedDays = Math.min(totalPlanDays, elapsedDays);
        if (completedPlanDays < expectedCompletedDays - 1) {
          isOnSchedule = false;
          scheduleStatusText = "Behind Schedule";
        }
      }
    }

    const userRole = userProfile?.targetRole || "Software Engineer";
    const userDailyHours = userProfile?.dailyGoalMinutes
      ? Math.max(1, Math.round(userProfile.dailyGoalMinutes / 60))
      : 4;

    return {
      id: plan.id,
      slug: plan.slug,
      name: plan.name,
      sourceUrl: plan.sourceUrl,
      role: userRole,
      dailyHours: userDailyHours,
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

  /**
   * Update task status for the currently authenticated user.
   * Modifies UserItemProgress strictly without mutating shared curriculum tables.
   */
  static async updateStudyTask(taskId: bigint, updates: UpdateTaskDto, userId?: string) {
    if (!userId) {
      throw new UnauthorizedError("Authentication required to update study tasks");
    }

    const task = await StudyPlanRepository.findTaskById(taskId);
    if (!task) {
      throw new NotFoundError(`Task #${taskId} not found`);
    }

    const isCompleted = updates.status === "completed";

    if (task.itemId) {
      if (isCompleted) {
        const existingProgress = await StudyPlanRepository.findUserProgress(userId, task.itemId);
        const currentSolveCount = existingProgress?.solveCount ?? 0;
        const now = new Date();
        const calculation = calculateNextRevision(currentSolveCount, true, now);

        await StudyPlanRepository.upsertUserProgress(userId, task.itemId, {
          status: calculation.status,
          solveCount: calculation.solveCount,
          lastSolvedAt: calculation.lastSolvedAt,
          nextRevisionAt: calculation.nextRevisionAt,
          lastScore: calculation.lastScore,
          completedAt: now,
        });
      } else {
        const existingProgress = await StudyPlanRepository.findUserProgress(userId, task.itemId);
        if (existingProgress) {
          await StudyPlanRepository.resetUserProgress(
            existingProgress.id,
            Math.max(0, existingProgress.solveCount - 1)
          );
        }
      }
    }

    return {
      taskId: task.taskId.toString(),
      dayId: task.dayId.toString(),
      sprintId: task.sprintId.toString(),
      itemId: task.itemId,
      taskOrder: task.taskOrder,
      status: isCompleted ? "completed" : "not_started",
      estimatedMinutes: task.estimatedMinutes || 20,
      actualMinutes: isCompleted ? task.estimatedMinutes || 20 : 0,
      isCarriedForward: task.isCarriedForward || false,
      isBacklog: task.isBacklog || false,
      isRevision: Boolean(updates.isRevision),
      item: task.item
        ? {
            id: task.item.id,
            title: task.item.title,
            slug: task.item.slug,
            type: task.item.type,
            difficulty: task.item.difficulty,
            subjectSlug: task.item.subject?.slug || "",
            subjectName: task.item.subject?.name || "",
            topicName: task.item.topic?.name || "",
            subtopicName: task.item.subtopic?.name ?? null,
          }
        : null,
    };
  }

  /**
   * Update study plan parameters (schedule / start dates)
   */
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

  /**
   * Fetch revision tasks for the authenticated user.
   */
  static async getRevisionList(userId?: string) {
    if (!userId) {
      return [];
    }

    const now = new Date();
    const tasks = await StudyPlanRepository.findRevisionTasks();
    const userProgressRecords = await StudyPlanRepository.findUserProgressForUser(userId);

    const progressMap = new Map<number, any>();
    for (const p of userProgressRecords) {
      progressMap.set(p.itemId, p);
    }

    return tasks.map((task: any) => {
      const p = task.itemId ? progressMap.get(task.itemId) : undefined;
      const isCompleted = Boolean(
        p && (p.status === "completed" || (p.solveCount > 0 && p.lastScore !== false))
      );
      const isDue = Boolean(
        p && (p.status === "needs_revision" || (p.nextRevisionAt && new Date(p.nextRevisionAt) <= now))
      );
      const statusInfo = formatRevisionStatus(p?.nextRevisionAt ?? null, p?.solveCount ?? 0, now);

      return {
        taskId: task.taskId.toString(),
        dayId: task.dayId.toString(),
        sprintId: task.sprintId.toString(),
        itemId: task.itemId,
        taskOrder: task.taskOrder,
        status: isCompleted ? "completed" : "not_started",
        estimatedMinutes: task.estimatedMinutes || 20,
        actualMinutes: isCompleted ? task.estimatedMinutes || 20 : 0,
        isCarriedForward: task.isCarriedForward || false,
        isBacklog: task.isBacklog || false,
        isRevision: isDue || task.isRevision,
        item: task.item
          ? {
              id: task.item.id,
              title: task.item.title,
              slug: task.item.slug,
              type: task.item.type,
              difficulty: task.item.difficulty,
              subjectSlug: task.item.subject?.slug || "",
              subjectName: task.item.subject?.name || "",
              topicName: task.item.topic?.name || "",
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

  /**
   * Safely delete all study plan progress for the authenticated user
   */
  static async deleteUserStudyPlan(slug: string = "crack-sde", userId?: string) {
    if (!userId) {
      throw new UnauthorizedError("Authentication required to delete study plan");
    }

    await StudyPlanRepository.deleteUserProgressForUser(userId);

    return {
      deleted: true,
      slug,
      userId,
    };
  }
}
