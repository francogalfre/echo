import {
  findByPublicKey,
  findBySecretKeyHash,
  hashKey,
  type ApiKeyRow,
} from "../services/api-keys";
import { insertFeedback, listFeedback } from "../services/feedback";
import type { ListResult, SubmitResult } from "../types";

type FeedbackInput = {
  authorization: string | undefined;
  name: string;
  feedback: string;
  email?: string;
  rating?: number;
};

type KeyKind = {
  prefix: "echo_sk_" | "echo_pk_";
  source: "api" | "widget";
  lookup: (token: string) => Promise<ApiKeyRow | undefined>;
};

const SECRET_KEY: KeyKind = {
  prefix: "echo_sk_",
  source: "api",
  lookup: (token) => findBySecretKeyHash(hashKey(token)),
};

const PUBLIC_KEY: KeyKind = {
  prefix: "echo_pk_",
  source: "widget",
  lookup: findByPublicKey,
};

function extractBearer(header: string | undefined): string | null {
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice(7).trim() || null;
}

async function createFeedbackWithKey(
  input: FeedbackInput,
  kind: KeyKind,
): Promise<SubmitResult> {
  const token = extractBearer(input.authorization);
  if (!token) return { success: false, status: 401, error: "Missing Bearer token" };

  if (!token.startsWith(kind.prefix)) {
    return { success: false, status: 403, error: `Requires a ${kind.prefix} key` };
  }

  const keyRow = await kind.lookup(token);
  if (!keyRow) return { success: false, status: 401, error: "Invalid API key" };

  await insertFeedback({
    organizationId: keyRow.organizationId,
    authorName: input.name,
    content: input.feedback,
    email: input.email,
    rating: input.rating,
    source: kind.source,
  });

  return { success: true };
}

export function submitFeedback(input: FeedbackInput): Promise<SubmitResult> {
  return createFeedbackWithKey(input, SECRET_KEY);
}

export function submitWidgetFeedback(input: FeedbackInput): Promise<SubmitResult> {
  return createFeedbackWithKey(input, PUBLIC_KEY);
}

export async function getFeedback(input: {
  authorization: string | undefined;
}): Promise<ListResult> {
  const token = extractBearer(input.authorization);
  if (!token) return { success: false, status: 401, error: "Missing Bearer token" };

  const kind = token.startsWith("echo_pk_")
    ? PUBLIC_KEY
    : token.startsWith("echo_sk_")
      ? SECRET_KEY
      : null;

  if (!kind) return { success: false, status: 401, error: "Invalid API key format" };

  const organizationId = (await kind.lookup(token))?.organizationId;
  if (!organizationId) return { success: false, status: 401, error: "Invalid API key" };

  return { success: true, feedback: await listFeedback(organizationId) };
}
