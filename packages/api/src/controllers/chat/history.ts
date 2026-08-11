import type { UIMessage } from "@echo/ai";

export type ChatHistoryBudget = {
  readonly maxChars: number;
};

export type TrimmedChatHistory = {
  readonly messages: UIMessage[];
  readonly omittedCount: number;
};

function messageCharLength(message: UIMessage): number {
  return message.parts.reduce((total, part) => {
    if (part.type === "text") return total + part.text.length;
    return total + JSON.stringify(part).length;
  }, 0);
}

export function trimChatHistory(
  messages: readonly UIMessage[],
  budget: ChatHistoryBudget,
): TrimmedChatHistory {
  const kept: UIMessage[] = [];
  let usedChars = 0;

  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const message = messages[i];
    if (!message) break;

    const length = messageCharLength(message);
    if (kept.length > 0 && usedChars + length > budget.maxChars) break;

    kept.unshift(message);
    usedChars += length;
  }

  return { messages: kept, omittedCount: messages.length - kept.length };
}
