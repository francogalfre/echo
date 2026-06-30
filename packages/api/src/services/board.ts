import { db } from "@echo/db";
import { boardItems } from "@echo/db/schema/board-items";
import { feedback } from "@echo/db/schema/feedback";
import { eq, asc } from "drizzle-orm";

export type BoardCard = {
  id: string;
  feedbackId: string;
  name: string;
  content: string;
  sentiment: string | null;
  tags: string[] | null;
  source: string;
  column: string;
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
      sentiment: feedback.sentiment,
      tags: feedback.tags,
      source: feedback.source,
      column: boardItems.column,
    })
    .from(boardItems)
    .innerJoin(feedback, eq(boardItems.feedbackId, feedback.id))
    .where(eq(boardItems.organizationId, organizationId))
    .orderBy(asc(boardItems.position));

  const result: BoardColumns = { backlog: [], in_progress: [], done: [] };
  for (const row of rows) {
    const col = row.column as keyof BoardColumns;
    if (col in result) result[col].push(row);
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
  column: "backlog" | "in_progress" | "done",
): Promise<void> {
  await db.update(boardItems).set({ column }).where(eq(boardItems.id, id));
}

export async function removeBoardItem(id: string): Promise<void> {
  await db.delete(boardItems).where(eq(boardItems.id, id));
}
