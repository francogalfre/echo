import { describe, expect, it } from "vitest";

import { badgeVariants } from "../badge-variants";

describe("badgeVariants", () => {
  it("should default to the neutral variant", () => {
    expect(badgeVariants({})).toContain("bg-secondary");
  });

  it("should map semantic variants to their token colors", () => {
    expect(badgeVariants({ variant: "success" })).toContain("text-success");
    expect(badgeVariants({ variant: "destructive" })).toContain("text-destructive");
    expect(badgeVariants({ variant: "accent" })).toContain("text-accent");
    expect(badgeVariants({ variant: "outline" })).toContain("border-border");
  });

  it("should always render as a pill", () => {
    expect(badgeVariants({ variant: "info" })).toContain("rounded-full");
  });
});
