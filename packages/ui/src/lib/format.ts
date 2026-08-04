const countFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

const compactFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatCount(value: number): string {
  return countFormatter.format(value);
}

export function formatCompact(value: number): string {
  return compactFormatter.format(value);
}

const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  timeZone: "UTC",
});

const monthDayFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

export function formatBucket(bucket: string, granularity: "day" | "month"): string {
  const date =
    granularity === "day"
      ? new Date(`${bucket}T00:00:00.000Z`)
      : new Date(`${bucket}-01T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return bucket;
  return (granularity === "day" ? monthDayFormatter : monthFormatter).format(date);
}

export function formatRelativeTime(input: Date | string, now: number = Date.now()): string {
  const date = input instanceof Date ? input : new Date(input);
  const diffMinutes = Math.floor((now - date.getTime()) / 60_000);
  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const hours = Math.floor(diffMinutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return monthDayFormatter.format(date);
}
