import { describe, expect, it } from "vitest";

import { avatarHue, initials } from "../avatar";

describe("initials", () => {
  it("should take first and last word initials", () => {
    expect(initials("John Doe")).toBe("JD");
    expect(initials("Priya Nair Kumar")).toBe("PK");
  });

  it("should use a single letter for one-word names", () => {
    expect(initials("Lens")).toBe("L");
  });

  it("should return ? for empty or whitespace names", () => {
    expect(initials("")).toBe("?");
    expect(initials("   ")).toBe("?");
  });
});

describe("avatarHue", () => {
  it("should be deterministic", () => {
    expect(avatarHue("John Doe")).toBe(avatarHue("John Doe"));
  });

  it("should stay within 0-359", () => {
    for (const name of ["a", "Marcus Reyes", "echo", "Tom Albrecht"]) {
      const hue = avatarHue(name);
      expect(hue).toBeGreaterThanOrEqual(0);
      expect(hue).toBeLessThan(360);
    }
  });

  it("should differ for different names", () => {
    expect(avatarHue("John Doe")).not.toBe(avatarHue("Priya Nair"));
  });
});
