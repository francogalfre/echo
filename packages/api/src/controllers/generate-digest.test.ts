import { beforeEach, describe, expect, it, vi } from "vitest";
import type { DigestOutput } from "@echo/ai";

import { generateFeedbackDigest } from "./generate-digest";

const SAMPLE_DIGEST: DigestOutput = {
  executiveSummary: "Users like the new dashboard.",
  themes: [],
  topIssues: [],
  positiveHighlight: "Fast onboarding.",
};

vi.mock("@echo/ai", () => ({
  generateDigest: vi.fn(),
}));

vi.mock("../services/ai-usage", () => ({
  getUsageCount: vi.fn(),
  incrementUsage: vi.fn(),
}));

vi.mock("../services/digest", () => ({
  getDigest: vi.fn(),
  getFeedbackForDigest: vi.fn(),
  hasFeedbackSince: vi.fn(),
  insertDigest: vi.fn(),
}));

vi.mock("../services/organization", () => ({
  getOrgPlan: vi.fn(),
}));

const { generateDigest } = await import("@echo/ai");
const { getUsageCount, incrementUsage } = await import("../services/ai-usage");
const { getDigest, getFeedbackForDigest, hasFeedbackSince, insertDigest } =
  await import("../services/digest");
const { getOrgPlan } = await import("../services/organization");

const ORG_ID = "org_1";

describe("generateFeedbackDigest", () => {
  beforeEach(() => {
    vi.mocked(generateDigest).mockReset();
    vi.mocked(getUsageCount).mockReset();
    vi.mocked(incrementUsage).mockReset();
    vi.mocked(getDigest).mockReset();
    vi.mocked(getFeedbackForDigest).mockReset();
    vi.mocked(hasFeedbackSince).mockReset();
    vi.mocked(insertDigest).mockReset();
    vi.mocked(getOrgPlan).mockReset();
  });

  it("should return the cached digest without calling the LLM when no new feedback arrived", async () => {
    const generatedAt = new Date("2026-07-01T00:00:00.000Z");
    vi.mocked(getOrgPlan).mockResolvedValue("pro");
    vi.mocked(getUsageCount).mockResolvedValue(0);
    vi.mocked(getDigest).mockResolvedValue({
      digest: SAMPLE_DIGEST,
      generatedAt,
      feedbackCount: 10,
    });
    vi.mocked(hasFeedbackSince).mockResolvedValue(false);

    const result = await generateFeedbackDigest(ORG_ID);

    expect(hasFeedbackSince).toHaveBeenCalledWith(ORG_ID, generatedAt);
    expect(generateDigest).not.toHaveBeenCalled();
    expect(insertDigest).not.toHaveBeenCalled();
    expect(incrementUsage).not.toHaveBeenCalled();
    expect(result).toEqual({
      success: true,
      digest: SAMPLE_DIGEST,
      generatedAt,
      feedbackCount: 10,
      cached: true,
    });
  });

  it("should generate a fresh digest and mark it as not cached when new feedback arrived", async () => {
    const generatedAt = new Date("2026-07-01T00:00:00.000Z");
    vi.mocked(getOrgPlan).mockResolvedValue("pro");
    vi.mocked(getUsageCount).mockResolvedValue(0);
    vi.mocked(getDigest).mockResolvedValue({
      digest: SAMPLE_DIGEST,
      generatedAt,
      feedbackCount: 10,
    });
    vi.mocked(hasFeedbackSince).mockResolvedValue(true);
    vi.mocked(getFeedbackForDigest).mockResolvedValue([
      { content: "great feature", sentiment: "positive", tags: [] },
    ]);
    vi.mocked(generateDigest).mockResolvedValue(SAMPLE_DIGEST);

    const result = await generateFeedbackDigest(ORG_ID);

    expect(generateDigest).toHaveBeenCalledTimes(1);
    expect(insertDigest).toHaveBeenCalledWith(ORG_ID, SAMPLE_DIGEST, 1);
    expect(result.success).toBe(true);
    expect(result.success && result.cached).toBe(false);
  });
});
