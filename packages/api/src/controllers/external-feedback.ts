import { findByPublicKey, findBySecretKeyHash, hashKey } from "../services/api-keys";
import { insertFeedback, listFeedback, type FeedbackListItem } from "../services/feedback";

type SubmitInput = {
  authorization: string | undefined;
  name: string;
  feedback: string;
  email?: string;
  rating?: number;
};

export type SubmitResult =
  | { success: true }
  | { success: false; status: 400 | 401 | 403; error: string };

export type ListResult =
  | { success: true; feedback: FeedbackListItem[] }
  | { success: false; status: 401; error: string };

function extractBearer(header: string | undefined): string | null {
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice(7).trim() || null;
}

export async function submitFeedback(input: SubmitInput): Promise<SubmitResult> {
  const token = extractBearer(input.authorization);
  if (!token) return { success: false, status: 401, error: "Missing Bearer token" };

  if (!token.startsWith("echo_sk_")) {
    return {
      success: false,
      status: 403,
      error: "POST requires a secret key (echo_sk_...)",
    };
  }

  const keyRow = await findBySecretKeyHash(hashKey(token));
  if (!keyRow) return { success: false, status: 401, error: "Invalid API key" };

  await insertFeedback({
    organizationId: keyRow.organizationId,
    authorName: input.name,
    content: input.feedback,
    email: input.email,
    rating: input.rating,
    source: "api",
  });

  return { success: true };
}

export async function getFeedback(input: {
  authorization: string | undefined;
}): Promise<ListResult> {
  const token = extractBearer(input.authorization);
  if (!token) return { success: false, status: 401, error: "Missing Bearer token" };

  let organizationId: string | undefined;

  if (token.startsWith("echo_pk_")) {
    organizationId = (await findByPublicKey(token))?.organizationId;
  } else if (token.startsWith("echo_sk_")) {
    organizationId = (await findBySecretKeyHash(hashKey(token)))?.organizationId;
  } else {
    return { success: false, status: 401, error: "Invalid API key format" };
  }

  if (!organizationId) return { success: false, status: 401, error: "Invalid API key" };

  return { success: true, feedback: await listFeedback(organizationId) };
}
