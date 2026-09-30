import type {
  UserProfileDto,
  ProfileStatsDto,
  UserProfileResponseDto,
  UpdateProfileRequestDto,
  SubjectProgressBreakdown,
  RecentActivityItem,
} from "@starter/shared";

export type {
  UserProfileDto,
  ProfileStatsDto,
  UserProfileResponseDto,
  UpdateProfileRequestDto,
  SubjectProgressBreakdown,
  RecentActivityItem,
};

export type ProfileTab =
  | "overview"
  | "curriculum"
  | "activity"
  | "edit"
  | "preferences";
