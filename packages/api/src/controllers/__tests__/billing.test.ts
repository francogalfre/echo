import { describe, expect, it, vi } from "vitest";

import { getBillingOverview } from "../billing";
import { countFeedbackTotal } from "../../services/feedback";
import { getDigest } from "../../services/feedback/digest";
import { countOwnedOrganizations, getOrgPlan } from "../../services/organization";
import { getUsageCount } from "../../services/ai/usage";

vi.mock("../../services/feedback");
vi.mock("../../services/feedback/digest");
vi.mock("../../services/organization");
vi.mock("../../services/ai/usage");

const ORG_ID = "org-1";
const USER_ID = "user-1";

describe("getBillingOverview", () => {
  it("should shape free plan limits with daily insight usage", async () => {
    vi.mocked(getOrgPlan).mockResolvedValue("free");
    vi.mocked(countFeedbackTotal).mockResolvedValue(120);
    vi.mocked(getUsageCount).mockResolvedValue(2);
    vi.mocked(getDigest).mockResolvedValue({
      digest: "test",
      generatedAt: new Date("2026-07-01T00:00:00.000Z"),
    } as unknown as { digest: string; generatedAt: Date });
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
      chat: { used: 2, limit: 10 },
    });
  });

  it("should shape pro plan limits with unlimited feedback and daily digest usage", async () => {
    vi.mocked(getOrgPlan).mockResolvedValue("pro");
    vi.mocked(countFeedbackTotal).mockResolvedValue(900);
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
      chat: { used: 4, limit: 50 },
    });
  });
});
