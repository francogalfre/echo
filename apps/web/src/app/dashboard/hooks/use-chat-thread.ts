"use client";

import { env } from "@echo/env/web";
import { useChat, type UIMessage } from "@ai-sdk/react";
import { DefaultChatTransport, isTextUIPart } from "ai";
import { useCallback, useMemo, useRef, useState } from "react";

import { captureChatMessageSent } from "@/lib/posthog";

import { isUpgradeError } from "../components/upgrade-error";

const CONVERSATION_ID_HEADER = "X-Conversation-Id";

function extractMessageText(message: UIMessage | undefined): string {
  if (!message) return "";

  return message.parts
    .filter(isTextUIPart)
    .map((part) => part.text)
    .join("");
}

export type ChatThreadStatus = ReturnType<typeof useChat>["status"];

export function useChatThread(): {
  messages: UIMessage[];
  status: ChatThreadStatus;
  error: Error | undefined;
  send: (text: string) => void;
  upgradeReason: string | null;
  dismissUpgrade: () => void;
  conversationId: string | null;
  startNewConversation: () => void;
  resumeConversation: (id: string, priorMessages: UIMessage[]) => void;
} {
  const conversationIdRef = useRef<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [upgradeReason, setUpgradeReason] = useState<string | null>(null);

  const applyConversationId = useCallback((id: string | null): void => {
    conversationIdRef.current = id;
    setConversationId(id);
  }, []);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: `${env.NEXT_PUBLIC_SERVER_URL}/api/chat/stream`,
        credentials: "include",
        prepareSendMessagesRequest: ({ messages }) => ({
          body: {
            conversationId: conversationIdRef.current ?? undefined,
            message: extractMessageText(messages.at(-1)),
          },
        }),
        fetch: async (input, init) => {
          const response = await fetch(input, init);

          if (!response.ok) {
            const body = (await response.clone().json()) as {
              error?: string;
              upgrade?: boolean;
            };
            const requestError = new Error(body.error ?? "Could not reach Echo.");
            Object.assign(requestError, { upgrade: body.upgrade ?? false });
            throw requestError;
          }

          const nextId = response.headers.get(CONVERSATION_ID_HEADER);
          if (nextId) applyConversationId(nextId);

          return response;
        },
      }),
    [applyConversationId],
  );

  const { messages, sendMessage, status, error, setMessages, clearError } = useChat({
    transport,
    onError: (chatError) => {
      if (isUpgradeError(chatError)) setUpgradeReason(chatError.message);
    },
  });

  const send = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      captureChatMessageSent({ length: text.trim().length });
      void sendMessage({ text: text.trim() });
    },
    [sendMessage],
  );

  const startNewConversation = useCallback(() => {
    applyConversationId(null);
    setMessages([]);
    clearError();
  }, [applyConversationId, setMessages, clearError]);

  const resumeConversation = useCallback(
    (id: string, priorMessages: UIMessage[]) => {
      applyConversationId(id);
      setMessages(priorMessages);
      clearError();
    },
    [applyConversationId, setMessages, clearError],
  );

  const dismissUpgrade = useCallback((): void => setUpgradeReason(null), []);

  return {
    messages,
    status,
    error,
    send,
    upgradeReason,
    dismissUpgrade,
    conversationId,
    startNewConversation,
    resumeConversation,
  };
}
