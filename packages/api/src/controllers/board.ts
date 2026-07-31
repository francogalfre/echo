import { addBoardItem } from "../services/board";

export type AddBoardItemResult =
  | { success: true }
  | { success: false; status: 409; error: string };

export async function addBoardItemForFeedback(
  organizationId: string,
  feedbackId: string,
): Promise<AddBoardItemResult> {
  const id = crypto.randomUUID();

  try {
    await addBoardItem(organizationId, feedbackId, id);
    return { success: true };
  } catch {
    return { success: false, status: 409, error: "Already on board" };
  }
}
