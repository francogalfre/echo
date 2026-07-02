export type StatsRange = "7d" | "30d" | "6m" | "1y" | "all";
export type SeriesGranularity = "day" | "month";
export type SeriesPoint = {
  bucket: string;
  positive: number;
  neutral: number;
  negative: number;
};

const DAY_MS = 24 * 60 * 60 * 1000;
const RANGE_DAYS = { "7d": 7, "30d": 30, "6m": 183, "1y": 365 } as const;

export function granularityFor(range: StatsRange): SeriesGranularity {
  return range === "7d" || range === "30d" ? "day" : "month";
}

export function rangeWindow(
  range: StatsRange,
  now: Date,
): { start: Date | null; prevStart: Date | null } {
  if (range === "all") return { start: null, prevStart: null };
  const days = RANGE_DAYS[range];
  return {
    start: new Date(now.getTime() - days * DAY_MS),
    prevStart: new Date(now.getTime() - 2 * days * DAY_MS),
  };
}

export function dayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function monthKey(date: Date): string {
  return date.toISOString().slice(0, 7);
}

function monthKeysBetween(start: Date, end: Date): string[] {
  const keys: string[] = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    keys.push(monthKey(cursor));
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  }
  return keys;
}

export function bucketKeys(range: StatsRange, now: Date, earliest?: string): string[] {
  if (range === "7d" || range === "30d") {
    const n = RANGE_DAYS[range];
    return Array.from({ length: n }, (_, i) =>
      dayKey(new Date(now.getTime() - (n - 1 - i) * DAY_MS)),
    );
  }

  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  if (range === "6m") {
    return monthKeysBetween(
      new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth() - 5, 1)),
      end,
    );
  }
  if (range === "1y") {
    return monthKeysBetween(
      new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth() - 11, 1)),
      end,
    );
  }

  if (!earliest) return [monthKey(end)];
  const [year = end.getUTCFullYear(), month = 1] = earliest.split("-").map(Number);
  return monthKeysBetween(new Date(Date.UTC(year, month - 1, 1)), end);
}

export function zeroFillSeries(
  keys: readonly string[],
  rows: readonly { bucket: string; sentiment: string | null; n: number }[],
): SeriesPoint[] {
  const map = new Map<string, SeriesPoint>(
    keys.map((key) => [key, { bucket: key, positive: 0, neutral: 0, negative: 0 }]),
  );
  for (const row of rows) {
    const point = map.get(row.bucket);
    if (!point) continue;
    if (row.sentiment === "positive") point.positive += row.n;
    else if (row.sentiment === "negative") point.negative += row.n;
    else point.neutral += row.n;
  }
  return [...map.values()];
}

export function growthPercent(current: number, previous: number): number | null {
  if (previous === 0) return null;
  return Math.round(((current - previous) / previous) * 100);
}
