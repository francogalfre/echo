"use client";

import { Diamond } from "@echo/ui/components/diamond";
import { cn } from "@echo/ui/lib/utils";
import type { UIMessage } from "@ai-sdk/react";
import { isTextUIPart } from "ai";
import { motion } from "motion/react";
import Image from "next/image";

import { Markdown } from "@/utils/markdown";

import type { AgentPersona } from "./agent-personas";

/*
  Some models emit tool calls as raw XML/DSML text instead of structured
  tool-invocation parts. We strip those tags so the user only sees the
  final answer.
*/
function stripToolXml(text: string): string {
  return text
    .replace(/<｜[^>]*>/g, "")
    .replace(/<\/｜[^>]*>/g, "")
    .replace(/<tool_call>[\s\S]*?<\/tool_call>/gi, "")
    .replace(/<arg_key>[\s\S]*?<\/arg_key>/gi, "")
    .replace(/<arg_value>[\s\S]*?<\/arg_value>/gi, "")
    .replace(/<invoke[^>]*>[\s\S]*?<\/invoke>/gi, "")
    .replace(/<parameter[^>]*>[\s\S]*?<\/parameter>/gi, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function messageText(message: UIMessage): string {
  return message.parts
    .filter(isTextUIPart)
    .map((part) => part.text)
    .join("");
}

type AgentChatMessagesProps = {
  messages: readonly UIMessage[];
  isBusy: boolean;
  agent: AgentPersona;
};

function TypingIndicator(): React.ReactElement {
  return (
    <div className="flex items-center gap-2.5 py-0.5">
      <Diamond className="size-5.5 text-muted-foreground/60" />
      <span className="text-base text-muted-foreground/60">Thinking</span>
    </div>
  );
}

export function AgentChatMessages({
  messages,
  isBusy,
  agent,
}: AgentChatMessagesProps): React.ReactElement {
  return (
    <div className="flex flex-col gap-5">
      {messages.map((message) => {
        const rawText = messageText(message);
        const text = stripToolXml(rawText);
        const isLast = message === messages[messages.length - 1];
        const isAssistant = message.role === "assistant";

        // Show "Thinking..." only for the last assistant bubble while streaming
        // and there is no visible text yet.
        const showTyping = isBusy && isAssistant && isLast && text.length === 0;

        return (
          <motion.div
            key={`msg-${message.id}`}
            initial={message.role === "user" ? { opacity: 0, y: 8, x: 12 } : false}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as const }}
            className={cn("flex gap-3", message.role === "user" && "flex-row-reverse")}
          >
            {isAssistant && (
              <span className="relative flex size-8 shrink-0 overflow-hidden rounded-lg bg-muted/50">
                <Image
                  src={agent.avatarImage}
                  alt={agent.name}
                  fill
                  className="object-contain"
                />
              </span>
            )}

            <div
              className={cn(
                "max-w-[85%] text-sm leading-relaxed",
                message.role === "user"
                  ? "rounded-2xl bg-muted px-4 py-3 text-foreground"
                  : "px-1 py-1 text-foreground",
              )}
            >
              {message.role === "user" ? (
                <span className="whitespace-pre-wrap">{rawText}</span>
              ) : showTyping ? (
                <TypingIndicator />
              ) : (
                <Markdown text={text} />
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
