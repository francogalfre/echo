import { beforeEach, describe, expect, it, vi } from "vitest";
import type { DigestOutput } from "@echo/ai";

import { generateFeedbackDigest } from "../digest";

const SAMPLE_DIGEST: DigestOutput = {
  executiveSummary: "Users like the new dashboard.",
  themes: [],
  topIssues: [],
  positiveHighlight: "Fast onboarding.",
};

const SAMPLE_USAGE = {
  model: "google/gemini-2.5-flash-lite",
  inputTokens: 100,
  outputTokens: 50,
  costMicroUsd: 10,
  cacheHit: false,
};

vi.mock("@echo/ai", () => ({
  generateDigest: vi.fn(),
}));

vi.mock("../../../services/ai/usage", () => ({
  reserveUsage: vi.fn(),
  releaseUsage: vi.fn(),
  getUsageCount: vi.fn(),
}));

vi.mock("../../../services/ai/events", () => ({
  recordAiEvent: vi.fn(),
}));

vi.mock("../../../services/feedback/digest", () => ({
  getDigest: vi.fn(),
  getFeedbackForDigest: vi.fn(),
  hasFeedbackSince: vi.fn(),
  insertDigest: vi.fn(),
}));

vi.mock("../../../services/organization", () => ({
  getOrgPlan: vi.fn(),
}));

const { generateDigest } = await import("@echo/ai");
const { reserveUsage, releaseUsage, getUsageCount } =
  await import("../../../services/ai/usage");
const { recordAiEvent } = await import("../../../services/ai/events");
const { getDigest, getFeedbackForDigest, hasFeedbackSince, insertDigest } =
  await import("../../../services/feedback/digest");
const { getOrgPlan } = await import("../../../services/organization");

const ORG_ID = "org_1";

describe("generateFeedbackDigest", () => {
  beforeEach(() => {
    vi.mocked(generateDigest).mockReset();
    vi.mocked(reserveUsage).mockReset();
    vi.mocked(releaseUsage).mockReset().mockResolvedValue(undefined);
    vi.mocked(getUsageCount).mockReset();
    vi.mocked(recordAiEvent).mockReset().mockResolvedValue(undefined);
    vi.mocked(getDigest).mockReset();
    vi.mocked(getFeedbackForDigest).mockReset();
    vi.mocked(hasFeedbackSince).mockReset();
    vi.mocked(insertDigest).mockReset();
    vi.mocked(getOrgPlan).mockReset();
  });

  it("should return the cached digest without calling the LLM when no new feedback arrived", async () => {
    const generatedAt = new Date("2026-07-01T00:00:00.000Z");
    vi.mocked(getOrgPlan).mockResolvedValue("pro");
    vi.mocked(reserveUsage).mockResolvedValue({ reserved: true, used: 1 });
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
    expect(releaseUsage).toHaveBeenCalledWith(ORG_ID, "digest", expect.any(String));
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
    vi.mocked(reserveUsage).mockResolvedValue({ reserved: true, used: 1 });
    vi.mocked(getDigest).mockResolvedValue({
      digest: SAMPLE_DIGEST,
      generatedAt,
      feedbackCount: 10,
    });
    vi.mocked(hasFeedbackSince).mockResolvedValue(true);
    vi.mocked(getFeedbackForDigest).mockResolvedValue([
      { content: "great feature", sentiment: "positive", tags: [] },
    ]);
    vi.mocked(generateDigest).mockResolvedValue({
      digest: SAMPLE_DIGEST,
      usage: SAMPLE_USAGE,
    });

    const result = await generateFeedbackDigest(ORG_ID);

    expect(generateDigest).toHaveBeenCalledTimes(1);
    expect(insertDigest).toHaveBeenCalledWith(ORG_ID, SAMPLE_DIGEST, 1);
    expect(releaseUsage).not.toHaveBeenCalled();
    expect(result.success).toBe(true);
    expect(result.success && result.cached).toBe(false);
  });

  it("should return an upgrade-flagged 403 when the pro daily digest quota is exhausted", async () => {
    vi.mocked(getOrgPlan).mockResolvedValue("pro");
    vi.mocked(reserveUsage).mockResolvedValue({ reserved: false, used: 10 });
    vi.mocked(getDigest).mockResolvedValue(null);

    const result = await generateFeedbackDigest(ORG_ID);

    expect(generateDigest).not.toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      status: 403,
      error: "Daily digest limit (10) reached. Resets tomorrow.",
      upgrade: false,
    });
  });
});
