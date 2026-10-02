import { prisma } from "../../lib/prisma.js";
import type { Prisma } from "@prisma/client";

export class ProfileRepository {
  /**
   * Find user with their profile
   */
  static async findUserWithProfile(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
      },
    });
  }

  /**
   * Upsert user profile
   */
  static async upsertUserProfile(
    userId: string,
    data: {
      headline?: string | null;
      bio?: string | null;
      targetRole?: string;
      targetCompany?: string;
      experience?: string;
      targetRegion?: string;
      preferredLanguage?: string;
      dailyGoalMinutes?: number;
      hasActivePlan?: boolean;
      planName?: string | null;
      planStartDate?: Date | null;
      selectedSubjects?: string[];
      githubUrl?: string | null;
      linkedinUrl?: string | null;
      leetcodeUrl?: string | null;
      websiteUrl?: string | null;
      emailNotifications?: boolean;
      weeklyDigest?: boolean;
    }
  ) {
    return prisma.userProfile.upsert({
      where: { userId },
      create: {
        userId,
        headline: data.headline,
        bio: data.bio,
        targetRole: data.targetRole ?? "Software Engineer",
        targetCompany: data.targetCompany ?? "Open to all",
        experience: data.experience ?? "0 - 2 years",
        targetRegion: data.targetRegion ?? "India",
        preferredLanguage: data.preferredLanguage ?? "TypeScript",
        dailyGoalMinutes: data.dailyGoalMinutes ?? 60,
        hasActivePlan: data.hasActivePlan ?? false,
        planName: data.planName,
        planStartDate: data.planStartDate,
        selectedSubjects: data.selectedSubjects ?? [],
        githubUrl: data.githubUrl,
        linkedinUrl: data.linkedinUrl,
        leetcodeUrl: data.leetcodeUrl,
        websiteUrl: data.websiteUrl,
        emailNotifications: data.emailNotifications ?? true,
        weeklyDigest: data.weeklyDigest ?? true,
      },
      update: {
        ...(data.headline !== undefined ? { headline: data.headline } : {}),
        ...(data.bio !== undefined ? { bio: data.bio } : {}),
        ...(data.targetRole !== undefined ? { targetRole: data.targetRole } : {}),
        ...(data.targetCompany !== undefined ? { targetCompany: data.targetCompany } : {}),
        ...(data.experience !== undefined ? { experience: data.experience } : {}),
        ...(data.targetRegion !== undefined ? { targetRegion: data.targetRegion } : {}),
        ...(data.preferredLanguage !== undefined ? { preferredLanguage: data.preferredLanguage } : {}),
        ...(data.dailyGoalMinutes !== undefined ? { dailyGoalMinutes: data.dailyGoalMinutes } : {}),
        ...(data.hasActivePlan !== undefined ? { hasActivePlan: data.hasActivePlan } : {}),
        ...(data.planName !== undefined ? { planName: data.planName } : {}),
        ...(data.planStartDate !== undefined ? { planStartDate: data.planStartDate } : {}),
        ...(data.selectedSubjects !== undefined ? { selectedSubjects: data.selectedSubjects } : {}),
        ...(data.githubUrl !== undefined ? { githubUrl: data.githubUrl } : {}),
        ...(data.linkedinUrl !== undefined ? { linkedinUrl: data.linkedinUrl } : {}),
        ...(data.leetcodeUrl !== undefined ? { leetcodeUrl: data.leetcodeUrl } : {}),
        ...(data.websiteUrl !== undefined ? { websiteUrl: data.websiteUrl } : {}),
        ...(data.emailNotifications !== undefined ? { emailNotifications: data.emailNotifications } : {}),
        ...(data.weeklyDigest !== undefined ? { weeklyDigest: data.weeklyDigest } : {}),
      },
    });
  }

  /**
   * Update core user attributes (name, image)
   */
  static async updateUser(
    userId: string,
    data: {
      name?: string;
      image?: string | null;
    }
  ) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.image !== undefined ? { image: data.image } : {}),
      },
    });
  }

  /**
   * Get learning and curriculum progress statistics for a user
   */
  static async getUserLearningStats(userId: string) {
    const [
      totalCurriculumItems,
      userProgressItems,
      subjects,
      recentActivity,
    ] = await Promise.all([
      prisma.roadmapItem.count(),
      prisma.userItemProgress.findMany({
        where: { userId },
        include: {
          item: {
            select: {
              id: true,
              subjectId: true,
              estimatedMinutes: true,
            },
          },
        },
      }),
      prisma.roadmapSubject.findMany({
        orderBy: { sortOrder: "asc" },
        include: {
          _count: {
            select: { items: true },
          },
        },
      }),
      prisma.userItemProgress.findMany({
        where: {
          userId,
          solveCount: { gt: 0 },
        },
        orderBy: [
          { lastSolvedAt: "desc" },
          { updatedAt: "desc" },
        ],
        take: 10,
        include: {
          item: {
            include: {
              subject: {
                select: {
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
      }),
    ]);

    return {
      totalCurriculumItems,
      userProgressItems,
      subjects,
      recentActivity,
    };
  }

  /**
   * Permanently delete user and all associated records across domains
   */
  static async deleteUserAccount(userId: string) {
    return prisma.$transaction([
      prisma.userProfile.deleteMany({ where: { userId } }),
      prisma.userItemProgress.deleteMany({ where: { userId } }),
      prisma.session.deleteMany({ where: { userId } }),
      prisma.account.deleteMany({ where: { userId } }),
      prisma.user.delete({ where: { id: userId } }),
    ]);
  }
}
