import type {
  RoadmapSubjectSummaryDto,
  RoadmapSubjectDetailDto,
  RoadmapTopicDto,
  RoadmapItemDto,
  UserItemProgressDto,
  TopicQuestionsResponseDto,
} from "@cracksde/shared";

export type {
  RoadmapSubjectSummaryDto,
  RoadmapSubjectDetailDto,
  RoadmapTopicDto,
  RoadmapItemDto,
  UserItemProgressDto,
  TopicQuestionsResponseDto,
};

export interface SubjectTheme {
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  iconBorder: string;
  badgeVariant: "cyan" | "amber" | "purple" | "blue" | "success" | "destructive";
}

export type PrepDifficultyFilter = "all" | "basic" | "core" | "pro";
export type PrepRevisionFilter = "all" | "due" | "solved" | "unsolved";

export interface PrepHubOverallStats {
  totalSubjects: number;
  totalQuestions: number;
  totalHours: number;
  totalDue: number;
  totalSolved: number;
}
