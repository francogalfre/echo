import { FREE_MONTHLY_FEEDBACK_LIMIT } from "../../lib/plan";
import {
  countFeedbackThisMonth,
  insertFeedback,
  type InsertFeedback,
} from "../../services/feedback";
import { insertNotification } from "../../services/notifications";
import { getOrgPlan } from "../../services/organization";
import type { SubmitResult } from "../../types";
import { enqueue } from "../enqueue";

export async function createFeedback(data: InsertFeedback): Promise<SubmitResult> {
  const plan = await getOrgPlan(data.organizationId);
  if (plan === "free") {
    const usedThisMonth = await countFeedbackThisMonth(data.organizationId);
    if (usedThisMonth >= FREE_MONTHLY_FEEDBACK_LIMIT) {
      return {
        success: false,
        status: 403,
        error: "Monthly feedback limit reached. Upgrade to Pro for unlimited feedback.",
      };
    }
  }

  const id = await insertFeedback(data);
  await enqueue(
    "feedback.enrich",
    { feedbackId: id, content: data.content },
    { organizationId: data.organizationId, dedupeKey: id },
  );

  insertNotification({
    organizationId: data.organizationId,
    type: "feedback.received",
    title: `New feedback from ${data.authorName}`,
    body: data.content.length > 120 ? `${data.content.slice(0, 120)}…` : data.content,
  }).catch((error: unknown) => {
    console.error("[echo:notifications] failed to write feedback.received", error);
  });

  return { success: true };
}
