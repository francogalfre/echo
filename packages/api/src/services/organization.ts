import { db } from "@echo/db";
import { type member, organization } from "@echo/db/schema/auth";
import { and, eq } from "drizzle-orm";

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
