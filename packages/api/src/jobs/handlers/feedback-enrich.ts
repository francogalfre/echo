import { analyzeFeedback } from "@echo/ai";

import { feedbackEnrichPayloadSchema } from "../kinds";
import { setFeedbackEnrichment } from "../../services/feedback";

export async function handleFeedbackEnrich(payload: unknown): Promise<void> {
  const { feedbackId, content } = feedbackEnrichPayloadSchema.parse(payload);

  const analysis = await analyzeFeedback(content);
  await setFeedbackEnrichment(feedbackId, {
    sentiment: analysis.sentiment,
    tags: analysis.tags,
  });
}
