import { enqueue } from "../../controllers/enqueue";
import { listOrganizationIdsWithFeedback } from "../../services/organization";

export async function handleDigestWeeklySweep(): Promise<void> {
  const organizationIds = await listOrganizationIdsWithFeedback();

  for (const organizationId of organizationIds) {
    await enqueue(
      "digest.generate",
      { organizationId },
      { organizationId, dedupeKey: organizationId },
    );
  }
}
