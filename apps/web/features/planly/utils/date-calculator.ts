import { formatDate } from "@/lib/formatters";

/**
 * Calculates end date by adding total active days to start date
 */
export function calculateEndDate(startDate: string | Date, totalDays: number): string {
  try {
    const start = typeof startDate === "string" ? new Date(startDate) : startDate;
    if (isNaN(start.getTime())) return "";
    const end = new Date(start);
    end.setDate(end.getDate() + totalDays);
    return formatDate(end);
  } catch {
    return "";
  }
}

/**
 * Calculates start and end interval for a specific sprint
 */
export function calculateSprintDateRange(
  planStartDate: string | Date,
  startDayOffset: number,
  durationDays: number
): string {
  try {
    const start = typeof planStartDate === "string" ? new Date(planStartDate) : planStartDate;
    if (isNaN(start.getTime())) return "";
    const sprintStart = new Date(start);
    sprintStart.setDate(sprintStart.getDate() + startDayOffset);

    const sprintEnd = new Date(sprintStart);
    sprintEnd.setDate(sprintEnd.getDate() + durationDays - 1);

    return `${formatDate(sprintStart, { month: "short", day: "numeric" })} - ${formatDate(sprintEnd, { month: "short", day: "numeric" })}`;
  } catch {
    return "";
  }
}

/**
 * Calculates day target date from sprint start offset
 */
export function calculateDayDate(planStartDate: string | Date, dayOffset: number): string {
  try {
    const start = typeof planStartDate === "string" ? new Date(planStartDate) : planStartDate;
    if (isNaN(start.getTime())) return "";
    const day = new Date(start);
    day.setDate(day.getDate() + dayOffset);
    return formatDate(day, { weekday: "short", month: "short", day: "numeric" });
  } catch {
    return "";
  }
}
