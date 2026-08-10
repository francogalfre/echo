import { convertToModelMessages, stepCountIs, streamText, type ToolSet } from "ai";

import { AIError } from "../../errors";
import { openrouterModel } from "../../lib/provider";
import { CHAT_MODEL } from "../../lib/model";
import { buildChatSystemPrompt } from "./prompt";
import { buildFeedbackTools, type ChatStreamInput } from "./tools";
import {
  createGeneration,
  createTrace,
  flushTracing,
  updateGeneration,
} from "../../lib/tracing";

export type ChatStreamResult = ReturnType<typeof streamText<ToolSet>>;

const timeoutMs = 60_000;
const maxOutputTokens = 600;
const stepLimit = 5;
const toolsDisabledFromStep = 3;
const maxAttempts = 2;
const retryDelayMs = 500;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function attemptStream(input: ChatStreamInput): Promise<ChatStreamResult> {
  const messages = await convertToModelMessages([...input.messages]);

  const trace = createTrace({
    name: "chat-agent",
    userId: input.traceContext?.userId,
    organizationId: input.traceContext?.organizationId,
    metadata: {
      conversationId: input.traceContext?.conversationId,
      model: CHAT_MODEL,
      messageCount: input.messages.length,
      hasDigest: !!input.digestSummary,
    },
    input: {
      messages: input.messages.map((m) => ({
        role: m.role,
        text: m.parts
          .filter((p) => p.type === "text")
          .map((p) => p.text)
          .join("")
          .slice(0, 200),
      })),
      digestSummary: input.digestSummary?.slice(0, 500),
    },
  });

  const generation = createGeneration(trace, {
    name: "chat-generation",
    model: CHAT_MODEL,
    system: buildChatSystemPrompt(input.digestSummary).slice(0, 500),
    messages,
    metadata: {
      temperature: 0.3,
      maxOutputTokens,
    },
  });

  return streamText({
    model: openrouterModel(CHAT_MODEL),
    system: buildChatSystemPrompt(input.digestSummary),
    messages,
    tools: buildFeedbackTools(input.retriever, input.spendBudget),
    stopWhen: stepCountIs(stepLimit),
    prepareStep: ({ stepNumber }) =>
      stepNumber >= toolsDisabledFromStep ? { activeTools: [] } : {},
    temperature: 0.3,
    maxOutputTokens,
    abortSignal: AbortSignal.timeout(timeoutMs),
    providerOptions: { openrouter: { usage: { include: true } } },
    onFinish: async ({ text, totalUsage }) => {
      try {
        updateGeneration(generation, text.slice(0, 1000), {
          inputTokens: totalUsage?.inputTokens,
          outputTokens: totalUsage?.outputTokens,
          totalTokens: totalUsage?.totalTokens,
        });
        await flushTracing();
      } catch {
        // Silently ignore tracing failures — never block the user
      }
    },
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
