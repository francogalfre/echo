import codingCharacter from "@echo/assets/character/coding.webp";
import thinkingCharacter from "@echo/assets/character/thinking.webp";
import { cn } from "@echo/ui/lib/utils";
import type { UIMessage } from "@ai-sdk/react";
import { isDynamicToolUIPart, isTextUIPart, isToolUIPart } from "ai";
import Image from "next/image";

import { Markdown } from "@/utils/markdown";

import { AiThinking } from "../ai/ai-thinking";
import type { AgentPersona } from "./agent-personas";

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
    .filter(isTextUIPart)
    .map((part) => part.text)
    .join("");
}

type AgentAvatarProps = {
  readonly agent: AgentPersona;
};

function AgentAvatar({ agent }: AgentAvatarProps): React.ReactElement {
  return (
    <span className="relative flex size-7 shrink-0 overflow-hidden rounded-full bg-muted">
      <Image src={agent.avatarImage} alt="" fill className="object-cover" />
    </span>
  );
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
  const lastMessage = messages.at(-1);
  const lastIsEmptyAssistantTurn =
    isBusy &&
    (!lastMessage || lastMessage.role === "user" || messageText(lastMessage).length === 0);
  const toolLabel = lastMessage ? activeToolLabel(lastMessage) : null;

  return (
    <div className="flex flex-col gap-5">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn("flex gap-3", message.role === "user" && "flex-row-reverse")}
        >
          {message.role === "assistant" && <AgentAvatar agent={agent} />}
          <div
            className={cn(
              "max-w-[80%] text-sm leading-relaxed",
              message.role === "user"
                ? "rounded-xl bg-muted px-4 py-2.5 text-foreground"
                : "px-1 py-1 text-foreground",
            )}
          >
            {message.role === "user" ? (
              messageText(message)
            ) : (
              <Markdown text={messageText(message)} />
            )}
          </div>
        </div>
      ))}

      {lastIsEmptyAssistantTurn && (
        <div className="flex gap-3">
          <span className="relative flex size-7 shrink-0 overflow-hidden rounded-full bg-muted">
            <Image
              src={toolLabel ? codingCharacter : thinkingCharacter}
              alt=""
              fill
              className="object-cover"
            />
          </span>
          <div className="flex items-center px-1 py-1">
            <AiThinking phrases={toolLabel ? [`${toolLabel}…`] : agent.thinkingPhrases}>
              <span />
            </AiThinking>
          </div>
        </div>
      )}
    </div>
  );
}
