"use client";

import type { UIMessage } from "@ai-sdk/react";
import { useCallback, useState } from "react";

import { trpc } from "@/lib/trpc";

export type ConversationItem = {
  readonly id: string;
  readonly title: string | null;
  readonly createdAt: Date;
  readonly lastMessageAt: Date;
};

export function useChatConversations(): {
  conversations: ConversationItem[];
  loading: boolean;
  refresh: () => Promise<void>;
  loadMessages: (conversationId: string) => Promise<UIMessage[]>;
} {
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const rows = await trpc.chat.listConversations.query();
      setConversations(
        rows.map((row) => ({
          id: row.id,
          title: row.title,
          createdAt: new Date(row.createdAt),
          lastMessageAt: new Date(row.lastMessageAt),
        })),
      );
    } catch {
      setConversations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMessages = useCallback(async (conversationId: string): Promise<UIMessage[]> => {
    const result = await trpc.chat.getMessages.query({ conversationId });
    return result.messages as unknown as UIMessage[];
  }, []);

  return { conversations, loading, refresh, loadMessages };
}
