/**
 * Spaced Repetition Schedule (Intervals in Days)
 * 1st solve -> 1 day
 * 2nd solve -> 3 days
 * 3rd solve -> 7 days
 * 4th solve -> 14 days
 * 5th solve and above -> 30 days
 */
export const SPACED_REPETITION_INTERVALS: Record<number, number> = {
  1: 1,
  2: 3,
  3: 7,
  4: 14,
  5: 30,
};

export const MAX_REPETITION_INTERVAL_DAYS = 30;
export const INCORRECT_SOLVE_REVISION_DAYS = 1;
