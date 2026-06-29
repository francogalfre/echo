import { classifySentiment } from "@echo/ai";

import { setFeedbackSentiment } from "../services/feedback";

export async function enrichFeedback(feedbackId: string, content: string): Promise<void> {
  try {
    const sentiment = await classifySentiment(content);
    await setFeedbackSentiment(feedbackId, sentiment);
  } catch (error) {
    console.error(`[echo:ai] failed to enrich feedback ${feedbackId}`, error);
  }
}
