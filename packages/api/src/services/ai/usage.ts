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

export async function reserveUsage(
  organizationId: string,
  feature: string,
  day: string,
  limit: number,
): Promise<{ reserved: boolean; used: number }> {
  const rows = await db
    .insert(aiUsage)
    .values({ id: crypto.randomUUID(), organizationId, feature, day, count: 1 })
    .onConflictDoUpdate({
      target: [aiUsage.organizationId, aiUsage.feature, aiUsage.day],
      set: { count: sql`${aiUsage.count} + 1` },
      setWhere: sql`${aiUsage.count} < ${limit}`,
    })
    .returning({ count: aiUsage.count });

  const row = rows[0];
  if (row) {
    return { reserved: true, used: row.count };
  }

  return { reserved: false, used: await getUsageCount(organizationId, feature, day) };
}

export async function releaseUsage(
  organizationId: string,
  feature: string,
  day: string,
): Promise<void> {
  await db
    .update(aiUsage)
    .set({ count: sql`greatest(${aiUsage.count} - 1, 0)` })
    .where(
      and(
        eq(aiUsage.organizationId, organizationId),
        eq(aiUsage.feature, feature),
        eq(aiUsage.day, day),
      ),
    );
}
