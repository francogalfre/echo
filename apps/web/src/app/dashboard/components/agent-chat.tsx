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

import { trpc } from "@/lib/trpc";

import { getAgent } from "./agent-personas";

type Message = {
  readonly id: string;
  readonly role: "user" | "assistant";
  readonly content: string;
  readonly timestamp: Date;
};

type AgentChatProps = {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
};

const SUGGESTED_QUESTIONS = [
  "What do users dislike most?",
  "What features are requested the most?",
  "What do users love about the product?",
  "What are the biggest pain points?",
];

export function AgentChat({ open, onOpenChange }: AgentChatProps): React.ReactElement {
  const [messages, setMessages] = useState<readonly Message[]>([]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const echo = getAgent("echo");
  const EchoIcon = echo.icon;

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isGenerating) return;

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: content.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsGenerating(true);

      try {
        const allMessages = [...messages, userMessage].map((m) => ({
          role: m.role,
          content: m.content,
          timestamp: m.timestamp.toISOString(),
        }));

        const result = await trpc.chat.send.mutate({ messages: allMessages });

        if (result.success) {
          const assistantMessage: Message = {
            id: crypto.randomUUID(),
            role: "assistant",
            content: result.response,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, assistantMessage]);
        } else {
          const errorMessage: Message = {
            id: crypto.randomUUID(),
            role: "assistant",
            content: `Sorry, ${result.error.toLowerCase()}`,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, errorMessage]);
        }
      } catch {
        const errorMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsGenerating(false);
      }
    },
    [messages, isGenerating],
  );

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    void sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage(input);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="p-0">
        <DrawerHeader className="border-b px-6 py-4">
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
              <DrawerTitle className="flex items-center gap-2">
                {echo.name}
                <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                  Pro
                </span>
              </DrawerTitle>
              <p className="text-xs text-muted-foreground">{echo.role}</p>
            </div>
          </div>
        </DrawerHeader>

        <div className="flex h-[400px] flex-col overflow-y-auto p-6">
          {messages.length === 0 && (
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
                  Echo reads all your feedback and answers questions like a real user.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTED_QUESTIONS.map((question) => (
                  <Button
                    key={question}
                    variant="outline"
                    size="sm"
                    onClick={() => void sendMessage(question)}
                    disabled={isGenerating}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn("flex gap-3", message.role === "user" && "flex-row-reverse")}
              >
                {message.role === "assistant" && (
                  <span
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-full",
                      echo.avatarBg,
                    )}
                  >
                    <EchoIcon className={cn("size-3.5", echo.avatarText)} />
                  </span>
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-xl px-4 py-2.5 text-sm",
                    message.role === "user"
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted",
                  )}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {isGenerating && (
              <div className="flex gap-3">
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full",
                    echo.avatarBg,
                  )}
                >
                  <EchoIcon className={cn("size-3.5", echo.avatarText)} />
                </span>
                <div className="flex items-center gap-2 rounded-xl bg-muted px-4 py-2.5">
                  <Icons.loading className="size-4 animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

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
              disabled={isGenerating}
            />
            <Button type="submit" size="icon" disabled={!input.trim() || isGenerating}>
              <Icons.arrowRight className="size-4" />
            </Button>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
