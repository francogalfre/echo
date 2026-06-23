import { db } from "@echo/db";
import { organization } from "@echo/db/schema/auth";
import { feedback, feedbackPageConfig } from "@echo/db/schema/feedback";
import { and, eq } from "drizzle-orm";

export type FeedbackPageConfig = typeof feedbackPageConfig.$inferSelect;
export type FeedbackRow = typeof feedback.$inferSelect;

type UpdateData = Partial<
  Omit<FeedbackPageConfig, "id" | "organizationId" | "createdAt" | "updatedAt">
>;

export function getFeedbackPageConfig(
  organizationId: string,
): Promise<FeedbackPageConfig | undefined> {
  return db.query.feedbackPageConfig.findFirst({
    where: (c) => eq(c.organizationId, organizationId),
  });
}

export async function upsertFeedbackPageConfig(
  organizationId: string,
  data: UpdateData,
): Promise<void> {
  await db
    .insert(feedbackPageConfig)
    .values({ id: crypto.randomUUID(), organizationId, ...data })
    .onConflictDoUpdate({
      target: feedbackPageConfig.organizationId,
      set: { ...data, updatedAt: new Date() },
    });
}

type OrgRow = typeof organization.$inferSelect;

export async function getFeedbackPageBySlug(slug: string): Promise<{
  org: OrgRow;
  config: FeedbackPageConfig;
} | null> {
  const org = await db.query.organization.findFirst({
    where: (o) => eq(o.slug, slug),
  });
  if (!org) return null;

  const config = await db.query.feedbackPageConfig.findFirst({
    where: (c) => and(eq(c.organizationId, org.id), eq(c.published, true)),
  });
  if (!config) return null;

  return { org, config };
}
