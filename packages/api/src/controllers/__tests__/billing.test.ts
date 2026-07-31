import { beforeEach, describe, expect, it, vi } from "vitest";
import type { DigestOutput } from "@echo/ai";

import { getBillingOverview } from "../billing";

const SAMPLE_DIGEST: DigestOutput = {
  executiveSummary: "Users like the new dashboard.",
  themes: [],
  topIssues: [],
  positiveHighlight: "Fast onboarding.",
};

vi.mock("../../services/ai-usage", () => ({
  getUsageCount: vi.fn(),
}));

vi.mock("../../services/digest", () => ({
  getDigest: vi.fn(),
}));

vi.mock("../../services/feedback", () => ({
  countFeedbackThisMonth: vi.fn(),
}));

vi.mock("../../services/organization", () => ({
  getOrgPlan: vi.fn(),
  countOwnedOrganizations: vi.fn(),
}));

const { getUsageCount } = await import("../../services/ai-usage");
const { getDigest } = await import("../../services/digest");
const { countFeedbackThisMonth } = await import("../../services/feedback");
const { getOrgPlan, countOwnedOrganizations } = await import("../../services/organization");

const ORG_ID = "org_1";
const USER_ID = "user_1";

describe("getBillingOverview", () => {
  beforeEach(() => {
    vi.mocked(getUsageCount).mockReset();
    vi.mocked(getDigest).mockReset();
    vi.mocked(countFeedbackThisMonth).mockReset();
    vi.mocked(getOrgPlan).mockReset();
    vi.mocked(countOwnedOrganizations).mockReset();
  });

  it("should shape free plan limits with a null digest limit and no digest usage", async () => {
    vi.mocked(getOrgPlan).mockResolvedValue("free");
    vi.mocked(countFeedbackThisMonth).mockResolvedValue(120);
    vi.mocked(getUsageCount).mockResolvedValue(2);
    vi.mocked(getDigest).mockResolvedValue({
      digest: SAMPLE_DIGEST,
      generatedAt: new Date("2026-07-01T00:00:00.000Z"),
      feedbackCount: 10,
    });
    vi.mocked(countOwnedOrganizations).mockResolvedValue(1);

    const overview = await getBillingOverview(ORG_ID, USER_ID);

    expect(overview).toEqual({
      plan: "free",
      feedback: { used: 120, limit: 300 },
      insights: { used: 2, limit: 3 },
      digests: {
        used: null,
        limit: null,
        lastGeneratedAt: new Date("2026-07-01T00:00:00.000Z"),
      },
      projects: { used: 1, limit: 1 },
      chat: { used: 2, limit: 5 },
    });
  });

  it("should shape pro plan limits with unlimited feedback and daily digest usage", async () => {
    vi.mocked(getOrgPlan).mockResolvedValue("pro");
    vi.mocked(countFeedbackThisMonth).mockResolvedValue(900);
    vi.mocked(getUsageCount).mockResolvedValue(4);
    vi.mocked(getDigest).mockResolvedValue(null);
    vi.mocked(countOwnedOrganizations).mockResolvedValue(3);

    const overview = await getBillingOverview(ORG_ID, USER_ID);

    expect(overview).toEqual({
      plan: "pro",
      feedback: { used: 900, limit: null },
      insights: { used: 4, limit: 50 },
      digests: { used: 4, limit: 10, lastGeneratedAt: null },
      projects: { used: 3, limit: 5 },
      chat: { used: 4, limit: 100 },
    });
  });
});
