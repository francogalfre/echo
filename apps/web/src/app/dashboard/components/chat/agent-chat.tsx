"use client";

import { Drawer, DrawerContent } from "@echo/ui/components/drawer";
import { useCallback, useEffect, useRef, useState } from "react";

import { useChatThread } from "../../hooks/use-chat-thread";
import { useChatUsage } from "../../hooks/use-chat-usage";
import { ErrorCard } from "../error-card";
import { UpgradeDialog } from "../dialogs/upgrade-dialog";
import { AGENT_PERSONAS } from "./agent-personas";
import { AgentChatComposer } from "./agent-chat-composer";
import { AgentChatEmptyState } from "./agent-chat-empty-state";
import { AgentChatHeader } from "./agent-chat-header";
import { AgentChatMessages } from "./agent-chat-messages";

type AgentChatProps = {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
};

const SUGGESTED_QUESTIONS = [
  "What do users dislike most?",
  "What features are requested the most?",
  "What are the biggest pain points?",
];

export function AgentChat({ open, onOpenChange }: AgentChatProps): React.ReactElement {
  const [input, setInput] = useState("");
  const [usageReloadKey, setUsageReloadKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrolledUpRef = useRef(false);
  const scrollRafRef = useRef<number | null>(null);

  const echo = AGENT_PERSONAS.echo;

  const thread = useChatThread();
  const usage = useChatUsage(usageReloadKey);

  const isBusy = thread.status === "submitted" || thread.status === "streaming";

  const handleScroll = useCallback((): void => {
    const container = containerRef.current;
    if (!container) return;
    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    scrolledUpRef.current = distanceFromBottom > 120;
  }, []);

  useEffect(() => {
    if (scrolledUpRef.current) return;
    if (scrollRafRef.current !== null) cancelAnimationFrame(scrollRafRef.current);
    scrollRafRef.current = requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      scrollRafRef.current = null;
    });
    return () => {
      if (scrollRafRef.current !== null) cancelAnimationFrame(scrollRafRef.current);
    };
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
      scrolledUpRef.current = false;
      thread.send(text);
      setInput("");
    },
    [thread, isBusy],
  );

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="p-0">
          <AgentChatHeader agent={echo} usage={usage.state} />

          <div
            ref={containerRef}
            onScroll={handleScroll}
            className="flex h-[50vh] flex-col overflow-y-auto p-4 sm:h-120 sm:p-6"
          >
            {thread.messages.length === 0 && (
              <AgentChatEmptyState
                agent={echo}
                questions={SUGGESTED_QUESTIONS}
                disabled={isBusy}
                onSelect={sendMessage}
              />
            )}

            <AgentChatMessages messages={thread.messages} isBusy={isBusy} agent={echo} />

            {thread.status === "error" && thread.error && (
              <ErrorCard
                className="mt-4"
                message={thread.error.message || "Something went wrong. Please try again."}
              />
            )}

            <div ref={messagesEndRef} />
          </div>

          <AgentChatComposer
            value={input}
            inputRef={inputRef}
            disabled={isBusy}
            onChange={setInput}
            onSubmit={handleSubmit}
            onKeyDown={handleKeyDown}
          />
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
