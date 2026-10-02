import { ProfileRepository } from "./profile.repository.js";
import { NotFoundError } from "../../shared/errors/app-error.js";
import type {
  UserProfileDto,
  ProfileStatsDto,
  UserProfileResponseDto,
  UpdateProfileRequestDto,
  SubjectProgressBreakdown,
  RecentActivityItem,
} from "@cracksde/shared";

export class ProfileService {
  /**
   * Fetch full user profile with computed stats
   */
  static async getProfile(userId: string): Promise<UserProfileResponseDto> {
    let user = await ProfileRepository.findUserWithProfile(userId);

    if (!user) {
      throw new NotFoundError("User account not found");
    }

    // Auto-create default profile record if user doesn't have one yet
    let profile = user.profile;
    if (!profile) {
      profile = await ProfileRepository.upsertUserProfile(userId, {
        targetRole: "Software Engineer",
        targetCompany: "Open to all",
        experience: "0 - 2 years",
        targetRegion: "India",
        preferredLanguage: "TypeScript",
        dailyGoalMinutes: 60,
      });
    }

    const stats = await this.getProfileStats(userId);

    const profileDto: UserProfileDto = {
      id: profile.id,
      userId: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image,
      headline: profile.headline,
      bio: profile.bio,
      targetRole: profile.targetRole || "Software Engineer",
      targetCompany: profile.targetCompany || "Open to all",
      experience: profile.experience || "0 - 2 years",
      targetRegion: profile.targetRegion || "India",
      preferredLanguage: profile.preferredLanguage || "TypeScript",
      dailyGoalMinutes: profile.dailyGoalMinutes || 60,
      hasActivePlan: profile.hasActivePlan ?? false,
      planName: profile.planName ?? null,
      planStartDate: profile.planStartDate ? profile.planStartDate.toISOString() : null,
      githubUrl: profile.githubUrl,
      linkedinUrl: profile.linkedinUrl,
      leetcodeUrl: profile.leetcodeUrl,
      websiteUrl: profile.websiteUrl,
      emailNotifications: profile.emailNotifications,
      weeklyDigest: profile.weeklyDigest,
      createdAt: user.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString(),
    };

    return {
      profile: profileDto,
      stats,
    };
  }

  /**
   * Update user profile information
   */
  static async updateProfile(
    userId: string,
    data: UpdateProfileRequestDto
  ): Promise<UserProfileResponseDto> {
    const user = await ProfileRepository.findUserWithProfile(userId);
    if (!user) {
      throw new NotFoundError("User account not found");
    }

    // If name or image is provided, update User table
    if (data.name !== undefined || data.image !== undefined) {
      await ProfileRepository.updateUser(userId, {
        name: data.name,
        image: data.image === "" ? null : data.image,
      });
    }

    // Upsert UserProfile table
    await ProfileRepository.upsertUserProfile(userId, {
      headline: data.headline,
      bio: data.bio,
      targetRole: data.targetRole,
      targetCompany: data.targetCompany,
      experience: data.experience,
      targetRegion: data.targetRegion,
      preferredLanguage: data.preferredLanguage,
      dailyGoalMinutes: data.dailyGoalMinutes,
      hasActivePlan: data.hasActivePlan,
      planName: data.planName,
      planStartDate: data.planStartDate ? new Date(data.planStartDate) : undefined,
      githubUrl: data.githubUrl === "" ? null : data.githubUrl,
      linkedinUrl: data.linkedinUrl === "" ? null : data.linkedinUrl,
      leetcodeUrl: data.leetcodeUrl === "" ? null : data.leetcodeUrl,
      websiteUrl: data.websiteUrl === "" ? null : data.websiteUrl,
      emailNotifications: data.emailNotifications,
      weeklyDigest: data.weeklyDigest,
    });

    return this.getProfile(userId);
  }

  /**
   * Get dynamic progress, streaks, and curriculum stats for a user
   */
  static async getProfileStats(userId: string): Promise<ProfileStatsDto> {
    const {
      totalCurriculumItems,
      userProgressItems,
      subjects,
      recentActivity,
    } = await ProfileRepository.getUserLearningStats(userId);

    const solvedProgress = userProgressItems.filter(
      (p) => p.status === "completed" || (p.solveCount > 0 && p.lastScore !== false)
    );
    const attemptedProgress = userProgressItems.filter((p) => p.solveCount > 0);

    const totalSolved = solvedProgress.length;
    const totalAttempted = attemptedProgress.length;
    const overallPercentage =
      totalCurriculumItems > 0
        ? Math.min(100, Math.round((totalSolved / totalCurriculumItems) * 100))
        : 0;

    // Estimate total time spent in minutes
    const totalTimeSpentMinutes = solvedProgress.reduce(
      (sum, p) => sum + (p.item?.estimatedMinutes || 15),
      0
    );

    // Dynamic points: 15 points per solved problem, 5 per attempt
    const studyPoints = totalSolved * 15 + Math.max(0, totalAttempted - totalSolved) * 5;

    // Revision metrics
    const now = new Date();
    const revisionsDueCount = userProgressItems.filter(
      (p) => p.nextRevisionAt && new Date(p.nextRevisionAt) <= now
    ).length;
    const revisionsMasteredCount = userProgressItems.filter(
      (p) => p.solveCount >= 3
    ).length;

    // Subject breakdown
    const solvedBySubject = new Map<number, number>();
    for (const p of solvedProgress) {
      if (p.item?.subjectId) {
        solvedBySubject.set(
          p.item.subjectId,
          (solvedBySubject.get(p.item.subjectId) || 0) + 1
        );
      }
    }

    const subjectBreakdown: SubjectProgressBreakdown[] = subjects.map((sub) => {
      const subjectTotal = sub._count.items;
      const subjectSolved = solvedBySubject.get(sub.id) || 0;
      const percentage =
        subjectTotal > 0
          ? Math.min(100, Math.round((subjectSolved / subjectTotal) * 100))
          : 0;

      return {
        subjectId: sub.id,
        name: sub.name,
        slug: sub.slug,
        totalItems: subjectTotal,
        solvedItems: subjectSolved,
        percentage,
      };
    });

    // Recent activity
    const formattedRecentActivity: RecentActivityItem[] = recentActivity.map((p) => ({
      id: p.id,
      itemId: p.itemId,
      itemTitle: p.item.title,
      itemSlug: p.item.slug,
      subjectName: p.item.subject.name,
      subjectSlug: p.item.subject.slug,
      status: p.status,
      difficulty: p.item.difficulty,
      solveCount: p.solveCount,
      lastSolvedAt: p.lastSolvedAt ? p.lastSolvedAt.toISOString() : null,
      lastScore: p.lastScore,
    }));

    return {
      totalSolved,
      totalAttempted,
      totalCurriculumItems,
      overallPercentage,
      streakDays: totalSolved > 0 ? Math.min(30, Math.max(1, Math.ceil(totalSolved / 2))) : 0,
      studyPoints,
      totalTimeSpentMinutes,
      subjectBreakdown,
      revisionsDueCount,
      revisionsMasteredCount,
      recentActivity: formattedRecentActivity,
    };
  }

  /**
   * Delete user account and cascade all associated data
   */
  static async deleteAccount(userId: string): Promise<{ success: boolean; message: string }> {
    const user = await ProfileRepository.findUserWithProfile(userId);
    if (!user) {
      throw new NotFoundError("User account not found");
    }

    await ProfileRepository.deleteUserAccount(userId);
    return {
      success: true,
      message: "Account and all associated progress data permanently deleted",
    };
  }
}
