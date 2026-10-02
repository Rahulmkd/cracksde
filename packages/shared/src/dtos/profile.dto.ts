export interface UserProfileDto {
  id: string;
  userId: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  headline: string | null;
  bio: string | null;
  targetRole: string;
  targetCompany: string;
  experience: string;
  targetRegion: string;
  preferredLanguage: string;
  dailyGoalMinutes: number;
  hasActivePlan?: boolean;
  planName?: string | null;
  planStartDate?: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  leetcodeUrl: string | null;
  websiteUrl: string | null;
  emailNotifications: boolean;
  weeklyDigest: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SubjectProgressBreakdown {
  subjectId: number;
  name: string;
  slug: string;
  totalItems: number;
  solvedItems: number;
  percentage: number;
}

export interface RecentActivityItem {
  id: string;
  itemId: number;
  itemTitle: string;
  itemSlug: string;
  subjectName: string;
  subjectSlug: string;
  status: string;
  difficulty: string | null;
  solveCount: number;
  lastSolvedAt: string | null;
  lastScore: boolean | null;
}

export interface ProfileStatsDto {
  totalSolved: number;
  totalAttempted: number;
  totalCurriculumItems: number;
  overallPercentage: number;
  streakDays: number;
  studyPoints: number;
  totalTimeSpentMinutes: number;
  subjectBreakdown: SubjectProgressBreakdown[];
  revisionsDueCount: number;
  revisionsMasteredCount: number;
  recentActivity: RecentActivityItem[];
}

export interface UserProfileResponseDto {
  profile: UserProfileDto;
  stats: ProfileStatsDto;
}

export interface UpdateProfileRequestDto {
  name?: string;
  image?: string | null;
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
  planStartDate?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  leetcodeUrl?: string | null;
  websiteUrl?: string | null;
  emailNotifications?: boolean;
  weeklyDigest?: boolean;
}
