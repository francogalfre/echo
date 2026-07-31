import { convertToModelMessages, stepCountIs, streamText, type ToolSet } from "ai";

import { AIError } from "../../errors";
import { openrouterModel } from "../../lib/provider";
import { DEFAULT_MODEL } from "../../lib/model";
import { buildChatSystemPrompt } from "./prompt";
import { buildFeedbackTools, type ChatStreamInput } from "./tools";

export type ChatStreamResult = ReturnType<typeof streamText<ToolSet>>;

const timeoutMs = 60_000;
const maxOutputTokens = 800;
const stepLimit = 6;
const toolsDisabledFromStep = 4;
const maxAttempts = 2;
const retryDelayMs = 500;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function attemptStream(input: ChatStreamInput): Promise<ChatStreamResult> {
  const messages = await convertToModelMessages([...input.messages]);

  return streamText({
    model: openrouterModel(DEFAULT_MODEL),
    system: buildChatSystemPrompt(input.digestSummary),
    messages,
    tools: buildFeedbackTools(input.retriever, input.spendBudget),
    stopWhen: stepCountIs(stepLimit),
    prepareStep: ({ stepNumber }) =>
      stepNumber >= toolsDisabledFromStep ? { activeTools: [] } : {},
    temperature: 0.4,
    maxOutputTokens,
    abortSignal: AbortSignal.timeout(timeoutMs),
    providerOptions: { openrouter: { usage: { include: true } } },
  });
}

export async function streamChatResponse(
  input: ChatStreamInput,
): Promise<ChatStreamResult> {
  let lastError: unknown = undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await attemptStream(input);
    } catch (error) {
      lastError = error;
      if (attempt < maxAttempts) await sleep(retryDelayMs);
    }
  }

  if (lastError instanceof AIError) throw lastError;
  throw new AIError("GENERATION_FAILED", "Chat response failed", { cause: lastError });
}
