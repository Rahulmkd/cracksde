import { prisma } from "../../lib/prisma.js";

export class StudyPlanRepository {
  static async findPlanBySlug(slug: string) {
    return prisma.studyPlan.findUnique({
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
  }

  static async findUserProgressForUser(userId: string) {
    return prisma.userItemProgress.findMany({
      where: { userId },
    });
  }

  static async findTaskById(taskId: bigint) {
    return prisma.studyTask.findUnique({
      where: { taskId },
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
}
