import { db } from "@echo/db";
import { member, organization } from "@echo/db/schema/auth";
import { and, count, eq } from "drizzle-orm";

type Member = typeof member.$inferSelect;

export function findMembership(
  userId: string,
  organizationId: string,
): Promise<Member | undefined> {
  return db.query.member.findFirst({
    where: (m) => and(eq(m.organizationId, organizationId), eq(m.userId, userId)),
  });
}

export async function updateOrganizationLogo(
  organizationId: string,
  logo: string,
): Promise<void> {
  await db.update(organization).set({ logo }).where(eq(organization.id, organizationId));
}

export async function getOrgPlan(organizationId: string): Promise<string | undefined> {
  const org = await db.query.organization.findFirst({
    where: (o) => eq(o.id, organizationId),
    columns: { plan: true },
  });

  return org?.plan;
}

export async function countOwnedOrganizations(userId: string): Promise<number> {
  const [row] = await db
    .select({ count: count() })
    .from(organization)
    .innerJoin(member, eq(member.organizationId, organization.id))
    .where(and(eq(member.userId, userId), eq(member.role, "owner")));

  return row?.count ?? 0;
}
