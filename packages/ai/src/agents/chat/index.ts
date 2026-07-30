import { convertToModelMessages, stepCountIs, streamText, type ToolSet } from "ai";

import { chatModel } from "./models";
import { buildChatSystemPrompt } from "./prompt";
import { buildFeedbackTools } from "./tools";
import type { ChatStreamInput } from "./types";

export type ChatStreamResult = ReturnType<typeof streamText<ToolSet>>;

const timeoutMs = 60_000;
const maxOutputTokens = 800;
const stepLimit = 6;
const toolsDisabledFromStep = 4;

export async function streamChatResponse(
  input: ChatStreamInput,
): Promise<ChatStreamResult> {
  const messages = await convertToModelMessages([...input.messages]);

  return streamText({
    model: chatModel,
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
