import { analyzeFeedback } from "@echo/ai";

import { setFeedbackEnrichment } from "../services/feedback";

export async function enrichFeedback(feedbackId: string, content: string): Promise<void> {
  try {
    const analysis = await analyzeFeedback(content);
    await setFeedbackEnrichment(feedbackId, {
      sentiment: analysis.sentiment,
      tags: analysis.tags,
    });
  } catch (error) {
    console.error(`[echo:ai] failed to enrich feedback ${feedbackId}`, error);
  }
}
