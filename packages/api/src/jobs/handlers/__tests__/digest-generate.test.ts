import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../../controllers/feedback/digest", () => ({
  generateFeedbackDigest: vi.fn(),
}));

const { generateFeedbackDigest } = await import("../../../controllers/feedback/digest");
const { handleDigestGenerate } = await import("../digest-generate");

describe("handleDigestGenerate", () => {
  beforeEach(() => {
    vi.mocked(generateFeedbackDigest).mockReset();
  });

  it("should reject a payload missing organizationId", async () => {
    await expect(handleDigestGenerate({})).rejects.toThrow();
    expect(generateFeedbackDigest).not.toHaveBeenCalled();
  });

  it("should call generateFeedbackDigest with the organizationId and resolve on success", async () => {
    vi.mocked(generateFeedbackDigest).mockResolvedValue({
      success: true,
      digest: {
        executiveSummary: "",
        themes: [],
        topIssues: [],
        positiveHighlight: "",
      },
      generatedAt: new Date(),
      feedbackCount: 3,
      cached: false,
    });

    await expect(
      handleDigestGenerate({ organizationId: "org_1" }),
    ).resolves.toBeUndefined();
    expect(generateFeedbackDigest).toHaveBeenCalledWith("org_1");
  });

  it("should resolve without throwing when generation is skipped for an expected domain reason", async () => {
    vi.mocked(generateFeedbackDigest).mockResolvedValue({
      success: false,
      status: 403,
      error: "Daily digest limit reached.",
      upgrade: false,
    });

    await expect(
      handleDigestGenerate({ organizationId: "org_1" }),
    ).resolves.toBeUndefined();
  });

  it("should throw so the job queue retries when generation fails unexpectedly", async () => {
    vi.mocked(generateFeedbackDigest).mockResolvedValue({
      success: false,
      status: 502,
      error: "Could not generate digest, please try again.",
      upgrade: false,
    });

    await expect(handleDigestGenerate({ organizationId: "org_1" })).rejects.toThrow(
      /digest\.generate failed for org_1/,
    );
  });
});
