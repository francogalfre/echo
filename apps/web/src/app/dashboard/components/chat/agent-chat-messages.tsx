import { cn } from "@echo/ui/lib/utils";
import type { UIMessage } from "@ai-sdk/react";
import { isDynamicToolUIPart, isToolUIPart } from "ai";

import { AiThinking } from "../ai/ai-thinking";
import type { AgentPersona } from "./agent-personas";
import { ChatMarkdown } from "./chat-markdown";

const TOOL_LABELS: Record<string, string> = {
  searchFeedback: "Searching feedback",
  countFeedback: "Counting feedback",
  getFeedbackById: "Fetching feedback",
  getTimeSeries: "Building a timeline",
  readDigest: "Reading the digest",
};

type ToolLikePart = { type: string; toolName?: string; state?: string };

function toolNameFromPart(part: ToolLikePart): string {
  if (part.toolName) return part.toolName;
  return part.type.replace(/^tool-/, "");
}

function activeToolLabel(message: UIMessage): string | null {
  for (const part of message.parts) {
    if (!isToolUIPart(part) && !isDynamicToolUIPart(part)) continue;
    if (part.state === "output-available" || part.state === "output-error") continue;

    const name = toolNameFromPart(part);
    return TOOL_LABELS[name] ?? "Working";
  }
  return null;
}

function messageText(message: UIMessage): string {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => (part as { text: string }).text)
    .join("");
}

type AgentChatMessagesProps = {
  messages: readonly UIMessage[];
  isBusy: boolean;
  agent: AgentPersona;
};

export function AgentChatMessages({
  messages,
  isBusy,
  agent,
}: AgentChatMessagesProps): React.ReactElement {
  const EchoIcon = agent.icon;
  const lastMessage = messages.at(-1);
  const lastIsEmptyAssistantTurn =
    isBusy &&
    (!lastMessage || lastMessage.role === "user" || messageText(lastMessage).length === 0);
  const toolLabel = lastMessage ? activeToolLabel(lastMessage) : null;

  return (
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
                agent.avatarBg,
              )}
            >
              <EchoIcon className={cn("size-3.5", agent.avatarText)} />
            </span>
          )}
          <div
            className={cn(
              "max-w-[80%] rounded-xl px-4 py-2.5",
              message.role === "user"
                ? "bg-accent text-accent-foreground text-sm"
                : "bg-muted",
            )}
          >
            {message.role === "user" ? (
              messageText(message)
            ) : (
              <ChatMarkdown text={messageText(message)} />
            )}
          </div>
        </div>
      ))}

      {lastIsEmptyAssistantTurn && (
        <div className="flex gap-3">
          <span
            className={cn(
              "flex size-7 shrink-0 items-center justify-center rounded-full",
              agent.avatarBg,
            )}
          >
            <EchoIcon className={cn("size-3.5", agent.avatarText)} />
          </span>
          <div className="rounded-xl bg-muted px-4 py-2.5">
            <AiThinking phrases={toolLabel ? [`${toolLabel}…`] : agent.thinkingPhrases}>
              <span />
            </AiThinking>
          </div>
        </div>
      )}
    </div>
  );
}
