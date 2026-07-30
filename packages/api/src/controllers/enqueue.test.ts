import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../services/jobs", () => ({
  insertJob: vi.fn(),
}));

const { insertJob } = await import("../services/jobs");
const { enqueue } = await import("./enqueue");

describe("enqueue", () => {
  beforeEach(() => {
    vi.mocked(insertJob).mockReset();
    vi.mocked(insertJob).mockResolvedValue({ enqueued: true });
  });

  it("should reject a payload that does not match the job kind's schema", async () => {
    await expect(enqueue("feedback.enrich", { feedbackId: "fb_1" })).rejects.toThrow();
    expect(insertJob).not.toHaveBeenCalled();
  });

  it("should validate the payload and call insertJob with the parsed shape", async () => {
    const result = await enqueue(
      "feedback.enrich",
      { feedbackId: "fb_1", content: "Great feature" },
      { organizationId: "org_1", dedupeKey: "fb_1" },
    );

    expect(insertJob).toHaveBeenCalledWith({
      kind: "feedback.enrich",
      payload: { feedbackId: "fb_1", content: "Great feature" },
      organizationId: "org_1",
      dedupeKey: "fb_1",
      maxAttempts: undefined,
      runAt: undefined,
    });
    expect(result).toEqual({ enqueued: true });
  });

  it("should accept an empty payload for sweep job kinds", async () => {
    await enqueue("feedback.enrich.sweep", {});

    expect(insertJob).toHaveBeenCalledWith(
      expect.objectContaining({ kind: "feedback.enrich.sweep", payload: {} }),
    );
  });
});
