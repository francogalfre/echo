import { findFirstOrganizationId, findMembership } from "../services/organization";

export type OrganizationContext = { organizationId: string; role: string };

export async function resolveOrganizationContext(
  userId: string,
  activeOrganizationId: string | null | undefined,
): Promise<OrganizationContext | null> {
  const organizationId = activeOrganizationId ?? (await findFirstOrganizationId(userId));
  if (!organizationId) return null;

  const membership = await findMembership(userId, organizationId);
  if (!membership) return null;

  return { organizationId, role: membership.role };
}
