import { describe, expect, it } from "vitest";
import { z } from "zod";

import { buildFeedbackTools, type FeedbackRetriever } from "../tools";

const stubRetriever: FeedbackRetriever = {
  search: async () => [],
  countBySentiment: async () => ({}),
  tagBreakdown: async () => [],
  byId: async () => [],
  timeSeries: async () => [],
  readDigest: async () => null,
};

describe("buildFeedbackTools", () => {
  it("should never expose an organization-identifying argument to the model", () => {
    const tools = buildFeedbackTools(stubRetriever, () => true);
    const suspiciousKeyPattern = /org|organization|tenant|account/i;

    for (const [toolName, definition] of Object.entries(tools)) {
      const schema = definition.inputSchema;
      if (!(schema instanceof z.ZodObject)) {
        throw new Error(`Tool "${toolName}" does not expose a Zod object input schema`);
      }

      for (const key of Object.keys(schema.shape)) {
        expect(key, `${toolName}.${key} looks org-scoped`).not.toMatch(
          suspiciousKeyPattern,
        );
      }
    }
  });

  it("should expose exactly the five retrieval tools chat needs", () => {
    const tools = buildFeedbackTools(stubRetriever, () => true);

    expect(Object.keys(tools).sort()).toEqual(
      [
        "countFeedback",
        "getFeedbackById",
        "getTimeSeries",
        "readDigest",
        "searchFeedback",
      ].sort(),
    );
  });
});
