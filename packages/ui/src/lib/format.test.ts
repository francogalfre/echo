import { describe, expect, it } from "vitest";

import { formatBucket, formatCompact, formatCount, formatRelativeTime } from "./format";

describe("formatCount", () => {
  it("should group thousands", () => {
    expect(formatCount(22_842)).toBe("22,842");
    expect(formatCount(0)).toBe("0");
  });

  it("should round non-integers", () => {
    expect(formatCount(1080.4)).toBe("1,080");
  });
});

describe("formatCompact", () => {
  it("should abbreviate thousands and millions", () => {
    expect(formatCompact(22_842)).toBe("22.8K");
    expect(formatCompact(1_200_000)).toBe("1.2M");
  });

  it("should leave small numbers alone", () => {
    expect(formatCompact(842)).toBe("842");
  });
});

describe("formatBucket", () => {
  it("should format day buckets as short month and day", () => {
    expect(formatBucket("2026-07-02", "day")).toBe("Jul 2");
  });

  it("should format month buckets as short month", () => {
    expect(formatBucket("2026-01", "month")).toBe("Jan");
  });

  it("should return the raw bucket when the string does not match the granularity", () => {
    expect(formatBucket("2026-06-30", "month")).toBe("2026-06-30");
  });
});

describe("formatRelativeTime", () => {
  const now = new Date("2026-07-02T12:00:00.000Z").getTime();

  it("should say just now under a minute", () => {
    expect(formatRelativeTime("2026-07-02T11:59:30.000Z", now)).toBe("just now");
  });

  it("should format minutes, hours and days", () => {
    expect(formatRelativeTime("2026-07-02T11:45:00.000Z", now)).toBe("15m ago");
    expect(formatRelativeTime("2026-07-02T09:00:00.000Z", now)).toBe("3h ago");
    expect(formatRelativeTime("2026-06-30T12:00:00.000Z", now)).toBe("2d ago");
  });

  it("should fall back to a short date after a week", () => {
    expect(formatRelativeTime("2026-06-12T12:00:00.000Z", now)).toBe("Jun 12");
  });
});
