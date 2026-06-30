import { db } from "@echo/db";
import { aiUsage } from "@echo/db/schema/ai-usage";
import { and, eq, sql } from "drizzle-orm";

export async function getUsageCount(
  organizationId: string,
  feature: string,
  day: string,
): Promise<number> {
  const row = await db.query.aiUsage.findFirst({
    where: (u) =>
      and(eq(u.organizationId, organizationId), eq(u.feature, feature), eq(u.day, day)),
  });

  return row?.count ?? 0;
}

export async function incrementUsage(
  organizationId: string,
  feature: string,
  day: string,
): Promise<void> {
  await db
    .insert(aiUsage)
    .values({ id: crypto.randomUUID(), organizationId, feature, day, count: 1 })
    .onConflictDoUpdate({
      target: [aiUsage.organizationId, aiUsage.feature, aiUsage.day],
      set: { count: sql`${aiUsage.count} + 1` },
    });
}
