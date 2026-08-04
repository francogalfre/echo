import { db } from "@echo/db";
import { notifications } from "@echo/db/schema/notifications";
import { and, count, desc, eq, isNull } from "drizzle-orm";

import type { NotificationType } from "../types";

export type NotificationRow = {
  id: string;
  type: NotificationType;
  title: string;
  body: string | null;
  link: string | null;
  readAt: Date | null;
  createdAt: Date;
};

export type InsertNotification = {
  organizationId: string;
  type: NotificationType;
  title: string;
  body?: string;
  link?: string;
};

export async function insertNotification(input: InsertNotification): Promise<void> {
  await db.insert(notifications).values({
    id: crypto.randomUUID(),
    organizationId: input.organizationId,
    type: input.type,
    title: input.title,
    body: input.body,
    link: input.link,
  });
}

export async function listNotifications(
  organizationId: string,
  limit: number,
): Promise<NotificationRow[]> {
  const rows = await db.query.notifications.findMany({
    where: eq(notifications.organizationId, organizationId),
    orderBy: [desc(notifications.createdAt)],
    limit,
    columns: {
      id: true,
      type: true,
      title: true,
      body: true,
      link: true,
      readAt: true,
      createdAt: true,
    },
  });

  return rows as NotificationRow[];
}

export async function countUnreadNotifications(organizationId: string): Promise<number> {
  const [row] = await db
    .select({ count: count() })
    .from(notifications)
    .where(
      and(eq(notifications.organizationId, organizationId), isNull(notifications.readAt)),
    );

  return row?.count ?? 0;
}

export async function markNotificationsRead(organizationId: string): Promise<void> {
  await db
    .update(notifications)
    .set({ readAt: new Date() })
    .where(
      and(eq(notifications.organizationId, organizationId), isNull(notifications.readAt)),
    );
}
