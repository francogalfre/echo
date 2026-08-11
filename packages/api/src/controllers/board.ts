import { addBoardItem } from "../services/board";
import { getFeedbackOrganizationId } from "../services/feedback";
import { logError } from "../lib/logger";

export type AddBoardItemResult =
  | { success: true }
  | { success: false; status: 404 | 409; error: string };

export async function addBoardItemForFeedback(
  organizationId: string,
  feedbackId: string,
): Promise<AddBoardItemResult> {
  const owner = await getFeedbackOrganizationId(feedbackId);

  if (owner !== organizationId) {
    return { success: false, status: 404, error: "Feedback not found" };
  }

  const id = crypto.randomUUID();

  try {
    await addBoardItem(organizationId, feedbackId, id);
    return { success: true };
  } catch (error) {
    logError(`board.addBoardItem for feedback ${feedbackId}`, error);
    return { success: false, status: 409, error: "Already on board" };
  }
}
