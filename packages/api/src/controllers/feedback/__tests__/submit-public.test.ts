import { beforeEach, describe, expect, it, vi } from "vitest";

import { submitPublicFeedback } from "../submit-public";

vi.mock("../create", () => ({
  createFeedback: vi.fn(),
}));

vi.mock("../../../lib/rate-limit", () => ({
  guardSubmission: vi.fn(),
}));

vi.mock("../../../services/feedback/page", () => ({
  getFeedbackPageBySlug: vi.fn(),
}));

const { createFeedback } = await import("../create");
const { guardSubmission } = await import("../../../lib/rate-limit");
const { getFeedbackPageBySlug } = await import("../../../services/feedback/page");

const PAGE = {
  org: { id: "org_1", name: "Lens", slug: "lens", logo: null, plan: "free" },
  config: { enableEmail: false, enableRating: false },
  feedback: [],
};

const INPUT = {
  slug: "lens",
  authorName: "John Doe",
  content: "Great product",
};

describe("submitPublicFeedback", () => {
  beforeEach(() => {
    vi.mocked(getFeedbackPageBySlug)
      .mockReset()
      .mockResolvedValue(PAGE as never);
    vi.mocked(guardSubmission).mockReset();
    vi.mocked(createFeedback).mockReset();
  });

  it("should insert on a first-time submission", async () => {
    vi.mocked(guardSubmission).mockResolvedValue({ allowed: true });
    vi.mocked(createFeedback).mockResolvedValue({ success: true, id: "fb_1" });

    const result = await submitPublicFeedback(INPUT, "1.2.3.4");

    expect(result).toEqual({ success: true, id: "fb_1" });
    expect(createFeedback).toHaveBeenCalledTimes(1);
  });

  it("should return a visible error and skip the insert on a duplicate submission", async () => {
    vi.mocked(guardSubmission).mockResolvedValue({
      allowed: false,
      status: 409,
      message: "You've already submitted this — thanks for your feedback!",
    });

    const result = await submitPublicFeedback(INPUT, "1.2.3.4");

    expect(result.success).toBe(false);
    if (result.success) throw new Error("unreachable");
    expect(result.status).toBe(409);
    expect(result.error.length).toBeGreaterThan(0);
    expect(createFeedback).not.toHaveBeenCalled();
  });
});
