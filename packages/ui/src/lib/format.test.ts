import { describe, expect, it } from "vitest";

import { formatCompact, formatCount } from "./format";

describe("formatCount", () => {
  it("should group thousands", () => {
    expect(formatCount(22842)).toBe("22,842");
    expect(formatCount(0)).toBe("0");
  });

  it("should round non-integers", () => {
    expect(formatCount(1080.4)).toBe("1,080");
  });
});

describe("formatCompact", () => {
  it("should abbreviate thousands and millions", () => {
    expect(formatCompact(22842)).toBe("22.8K");
    expect(formatCompact(1200000)).toBe("1.2M");
  });

  it("should leave small numbers alone", () => {
    expect(formatCompact(842)).toBe("842");
  });
});
