import { insertFeedback, type InsertFeedback } from "../services/feedback";
import { enrichFeedback } from "./enrich-feedback";

export async function createFeedback(data: InsertFeedback): Promise<string> {
  const id = await insertFeedback(data);
  void enrichFeedback(id, data.content);

  return id;
}
