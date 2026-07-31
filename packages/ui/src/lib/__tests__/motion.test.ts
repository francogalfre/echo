import { describe, expect, it } from "vitest";

import { durations, easings, fadeIn, fadeInUp, scaleIn, staggerContainer } from "../motion";

describe("motion presets", () => {
  it("should define the standard duration scale", () => {
    expect(durations).toEqual({ fast: 0.15, base: 0.2, slow: 0.3 });
  });

  it("should define ease-out curve used across the app", () => {
    expect(easings.out).toEqual([0.16, 1, 0.3, 1]);
  });

  it("should hide fadeInUp with a downward offset", () => {
    expect(fadeInUp.hidden).toEqual({ opacity: 0, y: 8 });
    expect(fadeInUp.visible).toMatchObject({ opacity: 1, y: 0 });
  });

  it("should scale from 97% in scaleIn", () => {
    expect(scaleIn.hidden).toEqual({ opacity: 0, scale: 0.97 });
  });

  it("should stagger children with the given delay", () => {
    const container = staggerContainer(0.05);
    expect(container.visible).toMatchObject({
      transition: { staggerChildren: 0.05 },
    });
    expect(fadeIn.hidden).toEqual({ opacity: 0 });
  });
});
