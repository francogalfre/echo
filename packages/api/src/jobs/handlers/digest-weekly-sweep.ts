import { listOrganizationIdsWithFeedback } from "../../services/organization";

export async function handleDigestWeeklySweep(): Promise<void> {
  const organizationIds = await listOrganizationIdsWithFeedback();

  console.warn(
    `[echo:jobs] digest.weekly.sweep found ${organizationIds.length} organizations with feedback (digest generation not yet wired up)`,
  );
}
