import { generateFeedbackDigest } from "../../controllers/feedback/digest";
import { digestGeneratePayloadSchema } from "../kinds";

export async function handleDigestGenerate(payload: unknown): Promise<void> {
  const { organizationId } = digestGeneratePayloadSchema.parse(payload);
  const result = await generateFeedbackDigest(organizationId);

  if (result.success || result.status !== 502) return;

  throw new Error(`digest.generate failed for ${organizationId}: ${result.error}`);
}
