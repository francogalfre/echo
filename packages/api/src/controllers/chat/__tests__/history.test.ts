import { describe, expect, it } from "vitest";
import type { UIMessage } from "@echo/ai";

import { trimChatHistory } from "../history";

function textMessage(id: string, text: string): UIMessage {
  return { id, role: "user", parts: [{ type: "text", text }] };
}

describe("trimChatHistory", () => {
  it("should keep every message when the total is within budget", () => {
    const messages = [
      textMessage("1", "hello"),
      textMessage("2", "world"),
      textMessage("3", "how are you"),
    ];

    const result = trimChatHistory(messages, { maxChars: 1000 });

    expect(result.messages).toEqual(messages);
    expect(result.omittedCount).toBe(0);
  });

  it("should return an empty result for an empty conversation", () => {
    const result = trimChatHistory([], { maxChars: 1000 });

    expect(result.messages).toEqual([]);
    expect(result.omittedCount).toBe(0);
  });

  it("should drop the oldest messages first once the budget is exceeded", () => {
    const messages = [
      textMessage("1", "a".repeat(50)),
      textMessage("2", "b".repeat(50)),
      textMessage("3", "c".repeat(50)),
    ];

    const result = trimChatHistory(messages, { maxChars: 120 });

    expect(result.messages.map((m) => m.id)).toEqual(["2", "3"]);
    expect(result.omittedCount).toBe(1);
  });

  it("should always keep at least the most recent message even if it alone exceeds the budget", () => {
    const messages = [textMessage("1", "short"), textMessage("2", "z".repeat(500))];

    const result = trimChatHistory(messages, { maxChars: 10 });

    expect(result.messages.map((m) => m.id)).toEqual(["2"]);
    expect(result.omittedCount).toBe(1);
  });

  it("should count non-text parts by their serialized JSON length", () => {
    const toolMessage: UIMessage = {
      id: "tool-1",
      role: "assistant",
      parts: [
        {
          type: "tool-searchFeedback",
          toolCallId: "call_1",
          state: "output-available",
          input: {},
          output: {
            results: Array.from({ length: 20 }, () => ({ excerpt: "x".repeat(50) })),
          },
        } as UIMessage["parts"][number],
      ],
    };
    const messages = [textMessage("1", "hi"), toolMessage];

    const result = trimChatHistory(messages, {
      maxChars: JSON.stringify(toolMessage.parts[0]).length,
    });

    expect(result.messages.map((m) => m.id)).toEqual(["tool-1"]);
    expect(result.omittedCount).toBe(1);
  });

  it("should preserve message order in the trimmed result", () => {
    const messages = [
      textMessage("1", "a"),
      textMessage("2", "b"),
      textMessage("3", "c"),
      textMessage("4", "d"),
    ];

    const result = trimChatHistory(messages, { maxChars: 1000 });

    expect(result.messages.map((m) => m.id)).toEqual(["1", "2", "3", "4"]);
  });
});
