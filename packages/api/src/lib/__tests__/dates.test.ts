import { describe, expect, it } from "vitest";

import {
  bucketKeys,
  dayKey,
  dayKeysBetween,
  granularityFor,
  growthPercent,
  monthKey,
  rangeWindow,
  zeroFillSeries,
} from "../dates";

const NOW = new Date("2026-07-02T15:30:00.000Z");

describe("granularityFor", () => {
  it("should use day buckets for short ranges", () => {
    expect(granularityFor("7d")).toBe("day");
    expect(granularityFor("30d")).toBe("day");
  });

  it("should use month buckets for long ranges", () => {
    expect(granularityFor("6m")).toBe("month");
    expect(granularityFor("1y")).toBe("month");
    expect(granularityFor("all")).toBe("month");
  });
});

describe("rangeWindow", () => {
  it("should align the window start to the first bucket day", () => {
    const { start, prevStart } = rangeWindow("7d", NOW);
    expect(start?.toISOString()).toBe("2026-06-26T00:00:00.000Z");
    expect(prevStart?.toISOString()).toBe("2026-06-19T00:00:00.000Z");
    expect(dayKey(start as Date)).toBe(bucketKeys("7d", NOW)[0]);
  });

  it("should return null bounds for all time", () => {
    expect(rangeWindow("all", NOW)).toEqual({ start: null, prevStart: null });
  });
});

describe("bucketKeys", () => {
  it("should produce 7 ascending day keys ending today", () => {
    const keys = bucketKeys("7d", NOW);
    expect(keys).toHaveLength(7);
    expect(keys[0]).toBe("2026-06-26");
    expect(keys[6]).toBe("2026-07-02");
  });

  it("should produce 30 day keys for 30d", () => {
    expect(bucketKeys("30d", NOW)).toHaveLength(30);
  });

  it("should produce 6 month keys ending in the current month", () => {
    const keys = bucketKeys("6m", NOW);
    expect(keys).toEqual([
      "2026-02",
      "2026-03",
      "2026-04",
      "2026-05",
      "2026-06",
      "2026-07",
    ]);
  });

  it("should produce 12 month keys for 1y", () => {
    const keys = bucketKeys("1y", NOW);
    expect(keys).toHaveLength(12);
    expect(keys[0]).toBe("2025-08");
    expect(keys[11]).toBe("2026-07");
  });

  it("should span from earliest month through now for all time", () => {
    const keys = bucketKeys("all", NOW, "2025-11");
    expect(keys[0]).toBe("2025-11");
    expect(keys[keys.length - 1]).toBe("2026-07");
    expect(keys).toHaveLength(9);
  });

  it("should fall back to the current month when all time has no data", () => {
    expect(bucketKeys("all", NOW)).toEqual(["2026-07"]);
  });
});

describe("dayKeysBetween", () => {
  it("should produce inclusive ascending day keys", () => {
    const keys = dayKeysBetween(new Date("2026-06-30T21:15:00.000Z"), NOW);
    expect(keys).toEqual(["2026-06-30", "2026-07-01", "2026-07-02"]);
  });

  it("should produce a single key when start and end are the same day", () => {
    expect(dayKeysBetween(NOW, NOW)).toEqual(["2026-07-02"]);
  });
});

describe("zeroFillSeries", () => {
  it("should zero-fill missing buckets and pivot sentiments", () => {
    const series = zeroFillSeries(
      ["2026-07-01", "2026-07-02"],
      [
        { bucket: "2026-07-02", sentiment: "positive", n: 3 },
        { bucket: "2026-07-02", sentiment: "negative", n: 1 },
      ],
    );
    expect(series).toEqual([
      { bucket: "2026-07-01", positive: 0, neutral: 0, negative: 0 },
      { bucket: "2026-07-02", positive: 3, neutral: 0, negative: 1 },
    ]);
  });

  it("should count null sentiment as neutral", () => {
    const series = zeroFillSeries(
      ["2026-07"],
      [
        { bucket: "2026-07", sentiment: null, n: 2 },
        { bucket: "2026-07", sentiment: "neutral", n: 1 },
      ],
    );
    expect(series[0]?.neutral).toBe(3);
  });

  it("should ignore rows outside the requested keys", () => {
    const series = zeroFillSeries(
      ["2026-07"],
      [{ bucket: "1999-01", sentiment: "positive", n: 5 }],
    );
    expect(series[0]?.positive).toBe(0);
  });
});

describe("growthPercent", () => {
  it("should return null when the previous period is zero", () => {
    expect(growthPercent(10, 0)).toBeNull();
  });

  it("should round to whole percentages", () => {
    expect(growthPercent(115, 100)).toBe(15);
    expect(growthPercent(80, 100)).toBe(-20);
  });
});

describe("keys", () => {
  it("should format UTC day and month keys", () => {
    expect(dayKey(NOW)).toBe("2026-07-02");
    expect(monthKey(NOW)).toBe("2026-07");
  });
});
