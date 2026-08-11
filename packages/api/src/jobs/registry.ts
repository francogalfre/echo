import { handleDigestGenerate } from "./handlers/digest-generate";
import { handleDigestWeeklySweep } from "./handlers/digest-weekly-sweep";
import { handleFeedbackEnrich } from "./handlers/feedback-enrich";
import { handleFeedbackEnrichSweep } from "./handlers/feedback-enrich-sweep";
import type { JobKind } from "./kinds";

export const jobRegistry: Record<JobKind, (payload: unknown) => Promise<void>> = {
  "feedback.enrich": handleFeedbackEnrich,
  "feedback.enrich.sweep": handleFeedbackEnrichSweep,
  "digest.weekly.sweep": handleDigestWeeklySweep,
  "digest.generate": handleDigestGenerate,
};
