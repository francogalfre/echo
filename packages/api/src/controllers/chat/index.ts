import { buildAgentUsage, streamChatResponse, type UIMessage } from "@echo/ai";
import { createUIMessageStreamResponse } from "ai";

import {
  buildFeedbackRetriever,
  createBudget,
  summarizeDigestForPrompt,
} from "./retriever";
import { trimChatHistory } from "./history";
import { enforceQuota } from "../quota";
import { resolveOrganizationContext } from "../../lib/organization";
import { recordAiEvent } from "../../services/ai/events";
import {
  appendMessage,
  createConversation,
  findConversation,
  listConversations,
  listMessages,
  nextSeq,
  type ChatConversationSummary,
} from "../../services/chat/conversations";
import { getDigest } from "../../services/feedback/digest";
import { logError } from "../../lib/logger";

const chatToolBudgetChars = 24_000;
const chatHistoryDbFetchLimit = 200;
const chatHistoryMaxChars = 40_000;

export type ChatOrganizationContext = { organizationId: string };

export type ChatTurnResult =
  | { success: true; response: Response; conversationId: string }
  | { success: false; status: 403 | 404 | 502; error: string; upgrade: boolean };

function toUIMessage(row: {
  id: string;
  role: string;
  parts: UIMessage["parts"];
}): UIMessage {
  return { id: row.id, role: row.role === "user" ? "user" : "assistant", parts: row.parts };
}

export async function resolveChatOrganization(
  userId: string,
  activeOrganizationId: string | null | undefined,
): Promise<ChatOrganizationContext | null> {
  const context = await resolveOrganizationContext(userId, activeOrganizationId);
  return context ? { organizationId: context.organizationId } : null;
}

export async function listChatConversations(
  organizationId: string,
  userId: string,
): Promise<ChatConversationSummary[]> {
  return listConversations(organizationId, userId);
}

export async function getChatMessages(
  organizationId: string,
  userId: string,
  conversationId: string,
): Promise<UIMessage[] | null> {
  const conversation = await findConversation(organizationId, userId, conversationId);
  if (!conversation) return null;

  const rows = await listMessages(organizationId, conversationId);
  return rows.map(toUIMessage);
}

export async function streamChatTurn(
  organizationId: string,
  userId: string,
  conversationId: string | null,
  messageText: string,
): Promise<ChatTurnResult> {
  const decision = await enforceQuota(organizationId, "chat");
  if (!decision.allowed) {
    return {
      success: false,
      status: 403,
      error: decision.message,
      upgrade: decision.upgrade,
    };
  }

  const startedAt = Date.now();

  try {
    const conversation = conversationId
      ? await findConversation(organizationId, userId, conversationId)
      : await createConversation(organizationId, userId);

    if (!conversation) {
      await decision.release();
      return {
        success: false,
        status: 404,
        error: "Conversation not found.",
        upgrade: false,
      };
    }

    const priorMessages = (
      await listMessages(organizationId, conversation.id, chatHistoryDbFetchLimit)
    ).map(toUIMessage);
    const userSeq = await nextSeq(conversation.id);
    const userMessage: UIMessage = {
      id: crypto.randomUUID(),
      role: "user",
      parts: [{ type: "text", text: messageText }],
    };

    await appendMessage({
      id: userMessage.id,
      conversationId: conversation.id,
      organizationId,
      role: "user",
      parts: userMessage.parts,
      seq: userSeq,
    });

    const digestRecord = await getDigest(organizationId);
    const digestSummary = digestRecord
      ? summarizeDigestForPrompt(digestRecord.digest)
      : null;
    const allMessages = [...priorMessages, userMessage];
    const { messages: modelMessages, omittedCount } = trimChatHistory(allMessages, {
      maxChars: chatHistoryMaxChars,
    });

    const streamResult = await streamChatResponse({
      messages: modelMessages,
      digestSummary,
      omittedHistoryCount: omittedCount,
      retriever: buildFeedbackRetriever(organizationId),
      spendBudget: createBudget(chatToolBudgetChars),
      traceContext: { userId, organizationId, conversationId: conversation.id },
    });

    const uiMessageStream = streamResult.toUIMessageStream({
      originalMessages: allMessages,
      generateMessageId: () => crypto.randomUUID(),
      onFinish: async ({ responseMessage }) => {
        try {
          const [usage, modelResponse, providerMetadata] = await Promise.all([
            streamResult.totalUsage,
            streamResult.response,
            streamResult.providerMetadata,
          ]);
          const agentUsage = buildAgentUsage({
            model: modelResponse.modelId,
            usage,
            providerMetadata,
          });

          await appendMessage({
            id: responseMessage.id,
            conversationId: conversation.id,
            organizationId,
            role: "assistant",
            parts: responseMessage.parts,
            seq: userSeq + 1,
            inputTokens: agentUsage.inputTokens,
            outputTokens: agentUsage.outputTokens,
          });

          await recordAiEvent({
            organizationId,
            feature: "chat",
            agent: "chat",
            model: agentUsage.model,
            promptVersion: 1,
            cacheHit: agentUsage.cacheHit,
            inputTokens: agentUsage.inputTokens,
            outputTokens: agentUsage.outputTokens,
            costMicroUsd: agentUsage.costMicroUsd,
            latencyMs: Date.now() - startedAt,
            status: "ok",
          });
        } catch (persistError) {
          logError("[echo:ai] failed to persist chat turn", persistError);
        }
      },
    });

    const response = createUIMessageStreamResponse({
      stream: uiMessageStream,
      headers: {
        "X-Conversation-Id": conversation.id,
      },
    });

    return { success: true, response, conversationId: conversation.id };
  } catch (error) {
    logError("[echo:ai] chat stream failed", error);
    await decision.release();

    return {
      success: false,
      status: 502,
      error: "Could not generate response, please try again.",
      upgrade: false,
    };
  }
}
