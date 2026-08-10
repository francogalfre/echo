import { FREE_FEEDBACK_LIMIT } from "../../lib/plan";
import {
  countFeedbackTotal,
  insertFeedback,
  type InsertFeedback,
} from "../../services/feedback";
import { insertNotification } from "../../services/notifications";
import { getOrgPlan } from "../../services/organization";
import type { SubmitResult } from "../../types";
import { enqueue } from "../enqueue";
import { logError } from "../../lib/logger";

export async function createFeedback(data: InsertFeedback): Promise<SubmitResult> {
  const plan = await getOrgPlan(data.organizationId);
  if (plan === "free") {
    const total = await countFeedbackTotal(data.organizationId);
    if (total >= FREE_FEEDBACK_LIMIT) {
      return {
        success: false,
        status: 403,
        error:
          "Feedback limit reached (300). Delete older feedback or upgrade to Pro for unlimited.",
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
    link: `/dashboard/feedback?feedback=${id}`,
  }).catch((error: unknown) => {
    logError("[echo:notifications] failed to write feedback.received", error);
  });

  return { success: true, id };
}
