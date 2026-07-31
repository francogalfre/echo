import { isKeyLive } from "../lib/api-key";
import { guardKeySubmission } from "../lib/rate-limit";
import {
  findByPublicKey,
  findBySecretKeyHash,
  hashKey,
  touchLastUsed,
  type ApiKeyRow,
} from "../services/api-keys";
import { listFeedback } from "../services/feedback";
import type { ListResult, SubmitResult } from "../types";
import { createFeedback } from "./create-feedback";

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
  requiredScope?: string;
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
  requiredScope: "feedback:write",
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
  if (!keyRow || !isKeyLive(keyRow)) {
    return { success: false, status: 401, error: "Invalid API key" };
  }

  if (kind.requiredScope && !keyRow.scopes.includes(kind.requiredScope)) {
    return { success: false, status: 403, error: "Key is missing required scope" };
  }

  const guard = await guardKeySubmission(hashKey(token));
  if (!guard.allowed) {
    return { success: false, status: 429, error: guard.message };
  }

  touchLastUsed(keyRow.id).catch(console.error);

  return createFeedback({
    organizationId: keyRow.organizationId,
    authorName: input.name,
    content: input.feedback,
    email: input.email,
    rating: input.rating,
    source: kind.source,
  });
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

  if (token.startsWith(PUBLIC_KEY.prefix)) {
    return { success: false, status: 403, error: `Requires a ${SECRET_KEY.prefix} key` };
  }

  if (!token.startsWith(SECRET_KEY.prefix)) {
    return { success: false, status: 401, error: "Invalid API key format" };
  }

  const keyRow = await SECRET_KEY.lookup(token);
  if (!keyRow || !isKeyLive(keyRow)) {
    return { success: false, status: 401, error: "Invalid API key" };
  }

  if (!keyRow.scopes.includes("feedback:read")) {
    return { success: false, status: 403, error: "Key is missing required scope" };
  }

  const guard = await guardKeySubmission(hashKey(token));
  if (!guard.allowed) {
    return { success: false, status: 429, error: guard.message };
  }

  touchLastUsed(keyRow.id).catch(console.error);

  return {
    success: true,
    feedback: await listFeedback(keyRow.organizationId, { limit: 50, offset: 0 }),
  };
}
