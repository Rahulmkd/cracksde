/**
 * Formats a duration given in minutes into a human-readable string (e.g. "2h 30m" or "45m").
 */
export function formatMinutes(minutes: number): string {
  if (!minutes || minutes <= 0) return "0m";
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

/**
 * Formats total hours with optional decimals into a display string (e.g. "270h" or "270.8h").
 */
export function formatHours(hours: number): string {
  if (Number.isInteger(hours)) {
    return `${hours}h`;
  }
  return `${hours.toFixed(1)}h`;
}

/**
 * Formats standard date strings into locale-friendly human representations.
 */
export function formatDate(
  dateInput: string | number | Date,
  options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  }
): string {
  if (!dateInput) return "";
  const d = typeof dateInput === "string" || typeof dateInput === "number" ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", options);
}

/**
 * Calculates and formats a progress percentage string (e.g. "75%").
 */
export function formatPercentage(value: number, total: number, decimals: number = 0): string {
  if (!total || total <= 0 || !value || value <= 0) return "0%";
  const pct = Math.min(100, Math.max(0, (value / total) * 100));
  return `${pct.toFixed(decimals)}%`;
}

/**
 * Formats numbers with comma separators (e.g. 1,420).
 */
export function formatNumber(num: number): string {
  if (num === undefined || num === null || isNaN(num)) return "0";
  return new Intl.NumberFormat("en-US").format(num);
}

/**
 * Formats a relative time description (e.g. "2h ago", "Just now").
 */
export function formatRelativeTime(dateInput: string | number | Date): string {
  if (!dateInput) return "";
  const d = typeof dateInput === "string" || typeof dateInput === "number" ? new Date(dateInput) : dateInput;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;
  return formatDate(d);
}
