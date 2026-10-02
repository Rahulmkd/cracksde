import { prisma } from "../../lib/prisma.js";

export class StudyPlanRepository {
  static async findPlanBySlug(slug: string) {
    return prisma.studyPlan.findFirst({
      where: {
        slug: { equals: slug, mode: "insensitive" },
      },
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
  }

  static async findUserProgressForUser(userId: string) {
    return prisma.userItemProgress.findMany({
      where: { userId },
    });
  }

  static async findUserProgress(userId: string, itemId: number) {
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
        completedAt: data.completedAt,
      },
    });
  }

  static async resetUserProgress(id: string, solveCount: number) {
    return prisma.userItemProgress.update({
      where: { id },
      data: {
        status: "not_started",
        completedAt: null,
        solveCount,
      },
    });
  }

  static async findTaskById(taskId: bigint) {
    return prisma.studyTask.findUnique({
      where: { taskId },
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
  }

  static async updateTask(taskId: bigint, data: Record<string, unknown>) {
    return prisma.studyTask.update({
      where: { taskId },
      data,
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
  }

  static async countCompletedTasksInDay(dayId: bigint) {
    return prisma.studyTask.count({
      where: {
        dayId,
        status: "completed",
      },
    });
  }

  static async countTotalTasksInDay(dayId: bigint) {
    return prisma.studyTask.count({
      where: { dayId },
    });
  }

  static async updateDayProgress(dayId: bigint, tasksCompleted: number, status: string) {
    return prisma.studyDay.update({
      where: { dayId },
      data: {
        tasksCompleted,
        status,
      },
    });
  }

  static async findSprintDays(sprintId: bigint) {
    return prisma.studyDay.findMany({
      where: { sprintId },
    });
  }

  static async updateSprintStatus(sprintId: bigint, status: string) {
    return prisma.studySprint.update({
      where: { sprintId },
      data: { status },
    });
  }

  static async updateStudyPlan(slug: string, data: Record<string, unknown>) {
    return prisma.studyPlan.update({
      where: { slug },
      data,
      include: {
        sprints: {
          orderBy: { sprintNo: "asc" },
        },
      },
    });
  }

  static async findDaysForPlan(planId: number) {
    return prisma.studyDay.findMany({
      where: { sprint: { planId } },
      orderBy: { planDayNo: "asc" },
    });
  }

  static async updateDayDate(dayId: bigint, calendarDate: Date) {
    return prisma.studyDay.update({
      where: { dayId },
      data: { calendarDate },
    });
  }

  static async findDaysForSprint(sprintId: bigint) {
    return prisma.studyDay.findMany({
      where: { sprintId },
      orderBy: { sprintDayNo: "asc" },
    });
  }

  static async updateSprintDates(sprintId: bigint, plannedStartDate: Date | null, plannedEndDate: Date | null) {
    return prisma.studySprint.update({
      where: { sprintId },
      data: {
        plannedStartDate,
        plannedEndDate,
      },
    });
  }

  static async findRevisionTasks() {
    return prisma.studyTask.findMany({
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
  }

  static async findUserProfile(userId: string) {
    return prisma.userProfile.findUnique({
      where: { userId },
    });
  }

  static async activateUserPlan(
    userId: string,
    data: {
      planName?: string;
      planStartDate?: Date | null;
      dailyGoalMinutes?: number;
      targetRole?: string;
      experience?: string;
      selectedSubjects?: string[];
    }
  ) {
    return prisma.userProfile.upsert({
      where: { userId },
      update: {
        hasActivePlan: true,
        ...(data.planName !== undefined ? { planName: data.planName } : {}),
        ...(data.planStartDate !== undefined ? { planStartDate: data.planStartDate } : {}),
        ...(data.dailyGoalMinutes !== undefined ? { dailyGoalMinutes: data.dailyGoalMinutes } : {}),
        ...(data.targetRole !== undefined ? { targetRole: data.targetRole } : {}),
        ...(data.experience !== undefined ? { experience: data.experience } : {}),
        ...(data.selectedSubjects !== undefined ? { selectedSubjects: data.selectedSubjects } : {}),
      },
      create: {
        userId,
        hasActivePlan: true,
        planName: data.planName || "Crack SDE",
        planStartDate: data.planStartDate || new Date(),
        dailyGoalMinutes: data.dailyGoalMinutes || 60,
        targetRole: data.targetRole || "Software Engineer",
        experience: data.experience || "0 - 2 years",
        selectedSubjects: data.selectedSubjects ?? [],
      },
    });
  }

  static async deactivateUserPlan(userId: string) {
    return prisma.userProfile.updateMany({
      where: { userId },
      data: {
        hasActivePlan: false,
        planName: null,
        planStartDate: null,
        selectedSubjects: [],
      },
    });
  }

  static async deleteUserProgressForUser(userId: string) {
    return prisma.userItemProgress.deleteMany({
      where: { userId },
    });
  }
}
