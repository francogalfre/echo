"use client";

import { Button } from "@echo/ui/components/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@echo/ui/components/drawer";
import { Icons } from "@echo/ui/components/icons";
import { cn } from "@echo/ui/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";

import { useChatConversations } from "../hooks/use-chat-conversations";
import { useChatThread } from "../hooks/use-chat-thread";
import { useChatUsage } from "../hooks/use-chat-usage";
import { AGENT_PERSONAS } from "./agent-personas";
import { AgentChatHistory } from "./agent-chat-history";
import { AgentChatMessages } from "./agent-chat-messages";
import { ErrorCard } from "./error-card";
import { UpgradeDialog } from "./upgrade-dialog";

type AgentChatProps = {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
};

const SUGGESTED_QUESTIONS = [
  "What do users dislike most?",
  "What features are requested the most?",
  "How many negative reviews mention billing?",
  "What are the biggest pain points?",
];

export function AgentChat({ open, onOpenChange }: AgentChatProps): React.ReactElement {
  const [input, setInput] = useState("");
  const [view, setView] = useState<"chat" | "history">("chat");
  const [usageReloadKey, setUsageReloadKey] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const echo = AGENT_PERSONAS.echo;
  const EchoIcon = echo.icon;

  const thread = useChatThread();
  const conversations = useChatConversations();
  const usage = useChatUsage(usageReloadKey);

  const isBusy = thread.status === "submitted" || thread.status === "streaming";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread.messages]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  useEffect(() => {
    if (thread.status === "ready") setUsageReloadKey((key) => key + 1);
  }, [thread.status]);

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim() || isBusy) return;
      thread.send(text);
      setInput("");
    },
    [thread, isBusy],
  );

  const openHistory = useCallback(async (): Promise<void> => {
    setView("history");
    await conversations.refresh();
  }, [conversations]);

  const selectConversation = useCallback(
    async (id: string): Promise<void> => {
      const priorMessages = await conversations.loadMessages(id);
      thread.resumeConversation(id, priorMessages);
      setView("chat");
    },
    [conversations, thread],
  );

  const startNewConversation = useCallback((): void => {
    thread.startNewConversation();
    setView("chat");
  }, [thread]);

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="p-0">
          <DrawerHeader className="border-b px-6 py-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full",
                    echo.avatarBg,
                  )}
                >
                  <EchoIcon className={cn("size-4", echo.avatarText)} />
                </span>
                <div>
                  <DrawerTitle>{echo.name}</DrawerTitle>
                  <p className="text-xs text-muted-foreground">
                    {usage.state.status === "ready"
                      ? `${usage.state.data.used}/${usage.state.data.limit} messages today`
                      : echo.role}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => void openHistory()}
                aria-label="Chat history"
              >
                <Icons.clock className="size-4" />
              </Button>
            </div>
          </DrawerHeader>

          {view === "history" ? (
            <AgentChatHistory
              conversations={conversations.conversations}
              loading={conversations.loading}
              activeId={thread.conversationId}
              onSelect={(id) => void selectConversation(id)}
              onNewConversation={startNewConversation}
            />
          ) : (
            <div className="flex h-[400px] flex-col overflow-y-auto p-6">
              {thread.messages.length === 0 && (
                <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
                  <span
                    className={cn(
                      "flex size-12 items-center justify-center rounded-full",
                      echo.avatarBg,
                    )}
                  >
                    <EchoIcon className={cn("size-6", echo.avatarText)} />
                  </span>
                  <div>
                    <p className="text-sm font-medium">Ask Echo anything</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Echo reads all your feedback and answers questions with real numbers.
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    {SUGGESTED_QUESTIONS.map((question) => (
                      <Button
                        key={question}
                        variant="outline"
                        size="sm"
                        onClick={() => sendMessage(question)}
                        disabled={isBusy}
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <AgentChatMessages messages={thread.messages} isBusy={isBusy} agent={echo} />

              {thread.status === "error" && thread.error && (
                <ErrorCard
                  className="mt-4"
                  message={
                    thread.error.message || "Something went wrong. Please try again."
                  }
                />
              )}

              <div ref={messagesEndRef} />
            </div>
          )}

          {view === "chat" && (
            <div className="border-t p-4">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about your feedback..."
                  className="flex-1 resize-none rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  rows={1}
                  disabled={isBusy}
                />
                <Button type="submit" size="icon" disabled={!input.trim() || isBusy}>
                  <Icons.arrowRight className="size-4" />
                </Button>
              </form>
            </div>
          )}
        </DrawerContent>
      </Drawer>

      <UpgradeDialog
        open={thread.upgradeReason !== null}
        onOpenChange={(next) => {
          if (!next) thread.dismissUpgrade();
        }}
        reason={thread.upgradeReason ?? ""}
      />
    </>
  );
}
