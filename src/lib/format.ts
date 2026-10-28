const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export function relativeTime(iso: string | null, now = Date.now()): string {
  if (!iso) return "";
  const diff = now - new Date(iso).getTime();
  if (diff < MINUTE) return "Just now";
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)}m ago`;
  if (diff < DAY) return `${Math.floor(diff / HOUR)}h ago`;
  if (diff < 2 * DAY) return "Yesterday";
  if (diff < 14 * DAY) return `${Math.floor(diff / DAY)}d ago`;
  return shortDate(iso);
}

/** "Today", "Yesterday", "12 Oct", or "12 Oct 2025" for other years. */
export function updatedLabel(iso: string | null, now = new Date()): string {
  if (!iso) return "";
  const d = new Date(iso);
  const startOfDay = (x: Date) =>
    new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const days = Math.round((startOfDay(now) - startOfDay(d)) / DAY);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  return shortDate(iso, d.getFullYear() !== now.getFullYear());
}

function shortDate(iso: string, withYear = false): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    ...(withYear && { year: "numeric" }),
  });
}
