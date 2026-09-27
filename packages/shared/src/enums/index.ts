export enum ItemType {
  Problem = "Problem",
  Quiz = "Quiz",
  Concept = "Concept",
  Code = "Code",
}

export enum Difficulty {
  Easy = "Easy",
  Medium = "Medium",
  Hard = "Hard",
}

export enum TaskStatus {
  NotStarted = "not_started",
  InProgress = "in_progress",
  Completed = "completed",
}

export enum SprintStatus {
  Upcoming = "upcoming",
  InProgress = "in_progress",
  Completed = "completed",
}

export enum DayStatus {
  Upcoming = "upcoming",
  InProgress = "in_progress",
  Completed = "completed",
}

export enum UserProgressStatus {
  NotStarted = "not_started",
  InProgress = "in_progress",
  Completed = "completed",
  NeedsRevision = "needs_revision",
  Mastered = "mastered",
}

export type RevisionStatusCode = "not_started" | "due" | "due_tomorrow" | "upcoming";
