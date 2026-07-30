import { enqueue } from "../../controllers/enqueue";
import { listUnenrichedFeedback } from "../../services/feedback";

const STALE_AFTER_MS = 5 * 60 * 1000;
const SWEEP_LIMIT = 500;

export async function handleFeedbackEnrichSweep(): Promise<void> {
  const staleSince = new Date(Date.now() - STALE_AFTER_MS);
  const unenriched = await listUnenrichedFeedback(staleSince, SWEEP_LIMIT);

  for (const item of unenriched) {
    await enqueue(
      "feedback.enrich",
      { feedbackId: item.id, content: item.content },
      { dedupeKey: item.id },
    );
  }
}
