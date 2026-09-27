import {
  SPACED_REPETITION_INTERVALS,
  MAX_REPETITION_INTERVAL_DAYS,
  INCORRECT_SOLVE_REVISION_DAYS,
} from "@cracksde/shared";
import type {
  RevisionCalculationResult,
  RevisionStatusInfo,
} from "@cracksde/shared";

export function getSpacedRepetitionIntervalDays(solveCount: number): number {
  return SPACED_REPETITION_INTERVALS[solveCount] ?? MAX_REPETITION_INTERVAL_DAYS;
}

/**
 * Calculates next revision date and updated progress based on correctness
 */
export function calculateNextRevision(
  currentSolveCount: number,
  isCorrect: boolean,
  baseDate: Date = new Date()
): RevisionCalculationResult {
  const lastSolvedAt = new Date(baseDate);

  if (isCorrect) {
    const nextSolveCount = currentSolveCount + 1;
    const intervalDays = getSpacedRepetitionIntervalDays(nextSolveCount);

    const nextRevisionAt = new Date(baseDate);
    nextRevisionAt.setDate(nextRevisionAt.getDate() + intervalDays);

    const status = nextSolveCount >= 5 ? "mastered" : "completed";
    const statusInfo = formatRevisionStatus(nextRevisionAt, nextSolveCount, baseDate);

    return {
      solveCount: nextSolveCount,
      lastSolvedAt,
      nextRevisionAt,
      lastScore: true,
      status,
      revisionStatusText: statusInfo.text,
      isDue: statusInfo.isDue,
    };
  } else {
    // Incorrect answer: schedule earlier revision (1 day) and mark as needs_revision
    const nextSolveCount = Math.max(1, currentSolveCount);
    const nextRevisionAt = new Date(baseDate);
    nextRevisionAt.setDate(nextRevisionAt.getDate() + INCORRECT_SOLVE_REVISION_DAYS);

    const statusInfo = formatRevisionStatus(nextRevisionAt, nextSolveCount, baseDate);

    return {
      solveCount: nextSolveCount,
      lastSolvedAt,
      nextRevisionAt,
      lastScore: false,
      status: "needs_revision",
      revisionStatusText: statusInfo.text,
      isDue: statusInfo.isDue,
    };
  }
}

/**
 * Formats user-friendly revision status string
 * e.g., "Revision Due", "Due Tomorrow", "Next Revision: 5 Oct", "Not Solved Yet"
 */
export function formatRevisionStatus(
  nextRevisionAt: Date | string | null,
  solveCount: number = 0,
  referenceDate: Date = new Date()
): RevisionStatusInfo {
  if (!nextRevisionAt || solveCount === 0) {
    return {
      text: "Not Solved Yet",
      isDue: false,
      code: "not_started",
    };
  }

  const target = new Date(nextRevisionAt);
  const now = new Date(referenceDate);

  // Normalize to local calendar midnight for accurate day comparison
  const targetMidnight = new Date(target.getFullYear(), target.getMonth(), target.getDate()).getTime();
  const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  const diffDays = Math.round((targetMidnight - nowMidnight) / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return {
      text: "Revision Due",
      isDue: true,
      code: "due",
    };
  }

  if (diffDays === 1) {
    return {
      text: "Due Tomorrow",
      isDue: false,
      code: "due_tomorrow",
    };
  }

  const day = target.getDate();
  const month = target.toLocaleString("en-US", { month: "short" });
  return {
    text: `Next Revision: ${day} ${month}`,
    isDue: false,
    code: "upcoming",
  };
}

/**
 * Aggregates overall topic revision status based on its questions progress
 */
export function computeTopicRevisionStatus(
  questions: Array<{ progress?: { isDue?: boolean; solveCount?: number } | null }>
): {
  totalQuestions: number;
  solvedQuestions: number;
  dueQuestions: number;
  hasRevisionDue: boolean;
  revisionStatusText: string;
} {
  const totalQuestions = questions.length;
  let solvedQuestions = 0;
  let dueQuestions = 0;

  for (const q of questions) {
    if (q.progress && (q.progress.solveCount ?? 0) > 0) {
      solvedQuestions++;
      if (q.progress.isDue) {
        dueQuestions++;
      }
    }
  }

  const hasRevisionDue = dueQuestions > 0;
  let revisionStatusText = "Not Started";

  if (hasRevisionDue) {
    revisionStatusText = "Revision Due";
  } else if (solvedQuestions === 0) {
    revisionStatusText = "Not Started";
  } else if (solvedQuestions === totalQuestions) {
    revisionStatusText = "Up to Date";
  } else {
    revisionStatusText = "In Progress";
  }

  return {
    totalQuestions,
    solvedQuestions,
    dueQuestions,
    hasRevisionDue,
    revisionStatusText,
  };
}
