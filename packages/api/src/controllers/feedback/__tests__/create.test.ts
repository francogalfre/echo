import { beforeEach, describe, expect, it, vi } from "vitest";

import { createFeedback } from "../create";

vi.mock("../../../services/feedback", () => ({
  countFeedbackTotal: vi.fn(),
  insertFeedback: vi.fn(),
}));

vi.mock("../../../services/notifications", () => ({
  insertNotification: vi.fn(),
}));

vi.mock("../../../services/organization", () => ({
  getOrgPlan: vi.fn(),
}));

vi.mock("../../enqueue", () => ({
  enqueue: vi.fn(),
}));

const { countFeedbackTotal, insertFeedback } = await import("../../../services/feedback");
const { insertNotification } = await import("../../../services/notifications");
const { getOrgPlan } = await import("../../../services/organization");
const { enqueue } = await import("../../enqueue");

const ORG_ID = "org_1";
const FEEDBACK_ID = "fb_1";

describe("createFeedback", () => {
  beforeEach(() => {
    vi.mocked(countFeedbackTotal).mockReset().mockResolvedValue(0);
    vi.mocked(insertFeedback).mockReset().mockResolvedValue(FEEDBACK_ID);
    vi.mocked(insertNotification).mockReset().mockResolvedValue(undefined);
    vi.mocked(getOrgPlan).mockReset().mockResolvedValue("free");
    vi.mocked(enqueue).mockReset().mockResolvedValue({ enqueued: true });
  });

  it("should insert a feedback.received notification linking to the new feedback item", async () => {
    await createFeedback({
      organizationId: ORG_ID,
      authorName: "Ada",
      content: "Great product",
      source: "widget",
    });

    expect(insertNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        organizationId: ORG_ID,
        type: "feedback.received",
        link: `/dashboard/feedback?feedback=${FEEDBACK_ID}`,
      }),
    );
  });

  it("should reject when the free plan feedback limit is reached", async () => {
    vi.mocked(countFeedbackTotal).mockResolvedValue(300);

    const result = await createFeedback({
      organizationId: ORG_ID,
      authorName: "Ada",
      content: "Great product",
      source: "widget",
    });

    expect(result.success).toBe(false);
    expect(insertFeedback).not.toHaveBeenCalled();
    expect(insertNotification).not.toHaveBeenCalled();
  });
});
