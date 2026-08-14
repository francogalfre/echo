"use client";

import { Diamond } from "@echo/ui/components/diamond";
import { Icons } from "@echo/ui/components/icons";
import { cn } from "@echo/ui/lib/utils";
import type { UIMessage } from "@ai-sdk/react";
import { getToolName, isReasoningUIPart, isTextUIPart, isToolUIPart } from "ai";
import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";

import { Markdown } from "@/utils/markdown";

import type { AgentPersona } from "./agent-personas";

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

const toolLabels: Record<string, string> = {
  searchFeedback: "Searched feedback",
  countFeedback: "Counted feedback",
  getFeedbackById: "Looked up feedback",
  getTimeSeries: "Checked trends",
  readDigest: "Read the latest digest",
  getEchoInfo: "Checked product info",
};

function toolLabel(toolName: string): string {
  return toolLabels[toolName] ?? `Used ${toolName}`;
}

type AgentChatMessagesProps = {
  messages: readonly UIMessage[];
  isBusy: boolean;
  agent: AgentPersona;
};

function TypingIndicator(): React.ReactElement {
  return (
    <div className="flex items-center gap-1.5 py-0.5">
      <Diamond className="size-3.5 text-muted-foreground/60" />
      <span className="text-xs text-muted-foreground/60">Thinking</span>
    </div>
  );
}

type ToolCallState = "running" | "done" | "error";

function toolCallState(state: string): ToolCallState {
  if (state === "output-available") return "done";
  if (state === "output-error" || state === "output-denied") return "error";
  return "running";
}

function ToolCallRow({
  toolName,
  state,
}: {
  toolName: string;
  state: ToolCallState;
}): React.ReactElement {
  return (
    <div className="flex items-center gap-1.5 py-0.5 text-xs text-muted-foreground/70">
      {state === "running" ? (
        <Diamond className="size-3.5 text-muted-foreground/60" />
      ) : state === "error" ? (
        <Icons.alertCircle className="size-3.5 text-destructive/70" />
      ) : (
        <Icons.check className="size-3.5 text-muted-foreground/60" />
      )}
      <span>{toolLabel(toolName)}</span>
    </div>
  );
}

function ReasoningDisclosure({
  text,
  streaming,
}: {
  text: string;
  streaming: boolean;
}): React.ReactElement | null {
  const [open, setOpen] = useState(false);

  if (!text.trim()) return null;

  return (
    <div className="py-0.5">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-1.5 text-xs text-muted-foreground/70 transition-colors hover:text-muted-foreground"
      >
        <Icons.chevronRight
          className={cn("size-3 transition-transform", open && "rotate-90")}
        />
        <span>{streaming ? "Thinking…" : "Thought for a moment"}</span>
      </button>
      {open && (
        <p className="mt-1 whitespace-pre-wrap pl-4.5 text-xs leading-relaxed text-muted-foreground/70">
          {text}
        </p>
      )}
    </div>
  );
}

type AgentChatMessageItemProps = {
  message: UIMessage;
  isLast: boolean;
  isBusy: boolean;
  agent: AgentPersona;
};

function renderAssistantParts(message: UIMessage): readonly React.ReactNode[] {
  return message.parts.map((part, index) => {
    if (isReasoningUIPart(part)) {
      return (
        <ReasoningDisclosure
          key={`reasoning-${index}`}
          text={part.text}
          streaming={part.state === "streaming"}
        />
      );
    }

    if (isToolUIPart(part)) {
      return (
        <ToolCallRow
          key={`tool-${part.toolCallId}`}
          toolName={getToolName(part)}
          state={toolCallState(part.state)}
        />
      );
    }

    if (isTextUIPart(part)) {
      const text = stripToolXml(part.text);
      if (!text) return null;
      return <Markdown key={`text-${index}`} text={text} />;
    }

    return null;
  });
}

function AgentChatMessageItem({
  message,
  isLast,
  isBusy,
  agent,
}: AgentChatMessageItemProps): React.ReactElement {
  const isAssistant = message.role === "assistant";
  const rawText = messageText(message);
  const content = isAssistant ? renderAssistantParts(message) : [];
  const hasRenderableContent = content.some((node) => node !== null);

  const showTyping = isBusy && isAssistant && isLast && !hasRenderableContent;
  const showEmptyNotice = isAssistant && !isBusy && !hasRenderableContent;

  return (
    <motion.div
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
            sizes="32px"
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
        ) : showEmptyNotice ? (
          <span className="text-sm text-muted-foreground/70">
            Echo didn&apos;t return a reply for this turn.
          </span>
        ) : (
          <div className="flex flex-col gap-1.5">{content}</div>
        )}
      </div>
    </motion.div>
  );
}

export function AgentChatMessages({
  messages,
  isBusy,
  agent,
}: AgentChatMessagesProps): React.ReactElement {
  return (
    <div className="flex flex-col gap-5">
      {messages.map((message, index) => (
        <AgentChatMessageItem
          key={`msg-${message.id}`}
          message={message}
          isLast={index === messages.length - 1}
          isBusy={isBusy}
          agent={agent}
        />
      ))}
    </div>
  );
}
