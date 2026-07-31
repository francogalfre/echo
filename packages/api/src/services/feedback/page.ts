import { db } from "@echo/db";
import { feedback, feedbackPageConfig } from "@echo/db/schema/feedback";
import { and, desc, eq } from "drizzle-orm";

export type FeedbackPageConfig = typeof feedbackPageConfig.$inferSelect;
export type FeedbackRow = typeof feedback.$inferSelect;

export type PublicOrganization = {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  plan: string;
};

export type PublicFeedbackItem = {
  id: string;
  authorName: string;
  content: string;
  rating: number | null;
  createdAt: Date;
};

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

export async function getFeedbackPageBySlug(slug: string): Promise<{
  org: PublicOrganization;
  config: FeedbackPageConfig;
  feedback: PublicFeedbackItem[];
} | null> {
  const org = await db.query.organization.findFirst({
    where: (o) => eq(o.slug, slug),
    columns: { id: true, name: true, slug: true, logo: true, plan: true },
  });

  if (!org) return null;

  const config = await db.query.feedbackPageConfig.findFirst({
    where: (c) => and(eq(c.organizationId, org.id), eq(c.published, true)),
  });

  if (!config) return null;

  if (!config.showFeedback) return { org, config, feedback: [] };

  const rows = await db.query.feedback.findMany({
    where: (f) => eq(f.organizationId, org.id),
    orderBy: [desc(feedback.createdAt)],
    limit: 12,
  });

  const recentFeedback = rows.map((row) => ({
    id: row.id,
    authorName: row.authorName,
    content: row.content,
    rating: row.rating,
    createdAt: row.createdAt,
  }));

  return { org, config, feedback: recentFeedback };
}
