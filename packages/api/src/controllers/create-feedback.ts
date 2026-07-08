import { FREE_MONTHLY_FEEDBACK_LIMIT } from "../lib/plan-limits";
import {
  countFeedbackThisMonth,
  insertFeedback,
  type InsertFeedback,
} from "../services/feedback";
import { getOrgPlan } from "../services/organization";
import type { SubmitResult } from "../types";
import { enrichFeedback } from "./enrich-feedback";

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
  void enrichFeedback(id, data.content);

  return { success: true };
}
