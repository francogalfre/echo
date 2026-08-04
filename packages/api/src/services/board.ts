import { db } from "@echo/db";
import { boardItems } from "@echo/db/schema/board-items";
import { feedback } from "@echo/db/schema/feedback";
import { and, asc, eq } from "drizzle-orm";

import type { BoardColumn } from "../types";

export type BoardCard = {
  id: string;
  feedbackId: string;
  name: string;
  content: string;
  email: string | null;
  rating: number | null;
  sentiment: string | null;
  tags: string[] | null;
  source: string;
  column: string;
  createdAt: Date;
  hasInsight: boolean;
};

export type BoardColumns = {
  backlog: BoardCard[];
  in_progress: BoardCard[];
  done: BoardCard[];
};

export async function getBoardItems(organizationId: string): Promise<BoardColumns> {
  const rows = await db
    .select({
      id: boardItems.id,
      feedbackId: boardItems.feedbackId,
      name: feedback.authorName,
      content: feedback.content,
      email: feedback.email,
      rating: feedback.rating,
      sentiment: feedback.sentiment,
      tags: feedback.tags,
      source: feedback.source,
      column: boardItems.column,
      createdAt: feedback.createdAt,
      insight: feedback.insight,
    })
    .from(boardItems)
    .innerJoin(feedback, eq(boardItems.feedbackId, feedback.id))
    .where(eq(boardItems.organizationId, organizationId))
    .orderBy(asc(boardItems.position));

  const result: BoardColumns = { backlog: [], in_progress: [], done: [] };
  for (const { insight, ...row } of rows) {
    const col = row.column as keyof BoardColumns;
    if (col in result) result[col].push({ ...row, hasInsight: insight != null });
  }
  return result;
}

export async function addBoardItem(
  organizationId: string,
  feedbackId: string,
  id: string,
): Promise<void> {
  await db.insert(boardItems).values({ id, organizationId, feedbackId, column: "backlog" });
}

export async function moveBoardItem(
  id: string,
  organizationId: string,
  column: BoardColumn,
  position: number,
): Promise<boolean> {
  const rows = await db
    .update(boardItems)
    .set({ column, position })
    .where(and(eq(boardItems.id, id), eq(boardItems.organizationId, organizationId)))
    .returning({ id: boardItems.id });

  return rows.length > 0;
}

export async function reindexColumn(
  organizationId: string,
  column: string,
  orderedIds: readonly string[],
): Promise<void> {
  await db.transaction(async (tx) => {
    await Promise.all(
      orderedIds.map((id, position) =>
        tx
          .update(boardItems)
          .set({ position })
          .where(
            and(
              eq(boardItems.id, id),
              eq(boardItems.organizationId, organizationId),
              eq(boardItems.column, column as BoardColumn),
            ),
          ),
      ),
    );
  });
}

export async function removeBoardItem(
  id: string,
  organizationId: string,
): Promise<boolean> {
  const rows = await db
    .delete(boardItems)
    .where(and(eq(boardItems.id, id), eq(boardItems.organizationId, organizationId)))
    .returning({ id: boardItems.id });

  return rows.length > 0;
}

export async function clearBoardColumn(
  organizationId: string,
  column: BoardColumn,
): Promise<void> {
  await db
    .delete(boardItems)
    .where(
      and(eq(boardItems.organizationId, organizationId), eq(boardItems.column, column)),
    );
}
