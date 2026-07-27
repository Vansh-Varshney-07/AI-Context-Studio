/**
 * Format an ISO timestamp into a relative "time ago" string.
 * e.g. "just now", "5m ago", "3h ago", "2d ago", "Jan 14".
 */
export function formatRelativeTime(
  date: string | Date,
  now: Date = new Date(),
): string {
  const target = typeof date === "string" ? new Date(date) : date;
  const diff = now.getTime() - target.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 10) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return target.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/**
 * Format an ISO timestamp into a compact absolute date.
 * e.g. "Jan 14, 2025".
 */
export function formatDate(date: string | Date): string {
  const target = typeof date === "string" ? new Date(date) : date;
  return target.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
