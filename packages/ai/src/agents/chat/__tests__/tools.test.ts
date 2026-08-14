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

  it("should expose exactly the six retrieval and product-info tools chat needs", () => {
    const tools = buildFeedbackTools(stubRetriever, () => true);

    expect(Object.keys(tools).sort()).toEqual(
      [
        "countFeedback",
        "getEchoInfo",
        "getFeedbackById",
        "getTimeSeries",
        "readDigest",
        "searchFeedback",
      ].sort(),
    );
  });

  it("should allow searchFeedback to list by sentiment without a query", async () => {
    const calls: { query: string | null; limit: number; sentiment?: string }[] = [];
    const retriever: FeedbackRetriever = {
      ...stubRetriever,
      search: async (query, limit, sentiment) => {
        calls.push({ query, limit, sentiment });
        return [];
      },
    };
    const tools = buildFeedbackTools(retriever, () => true);
    const searchFeedback = tools.searchFeedback;
    if (!searchFeedback) {
      throw new Error("searchFeedback tool is missing");
    }

    const parsedInput = searchFeedback.inputSchema;
    if (!(parsedInput instanceof z.ZodObject)) {
      throw new Error("searchFeedback does not expose a Zod object input schema");
    }
    const validated = parsedInput.parse({ sentiment: "negative" });
    expect(validated.query).toBeUndefined();

    if (!searchFeedback.execute) {
      throw new Error("searchFeedback has no execute function");
    }
    await searchFeedback.execute(validated, { toolCallId: "t1", messages: [] });

    expect(calls).toEqual([{ query: null, limit: 10, sentiment: "negative" }]);
  });

  it("should return { error: true } instead of throwing when a retriever call fails", async () => {
    const failingRetriever: FeedbackRetriever = {
      ...stubRetriever,
      search: async () => {
        throw new Error("db unavailable");
      },
      countBySentiment: async () => {
        throw new Error("db unavailable");
      },
      byId: async () => {
        throw new Error("db unavailable");
      },
      timeSeries: async () => {
        throw new Error("db unavailable");
      },
      readDigest: async () => {
        throw new Error("db unavailable");
      },
    };
    const tools = buildFeedbackTools(failingRetriever, () => true);

    const searchResult = await tools.searchFeedback?.execute?.(
      { sentiment: "negative", limit: 10 },
      { toolCallId: "t1", messages: [] },
    );
    expect(searchResult).toEqual({ error: true, message: expect.any(String) });

    const countResult = await tools.countFeedback?.execute?.(
      { groupBy: "sentiment" },
      { toolCallId: "t2", messages: [] },
    );
    expect(countResult).toEqual({ error: true, message: expect.any(String) });

    const byIdResult = await tools.getFeedbackById?.execute?.(
      { ids: ["1"] },
      { toolCallId: "t3", messages: [] },
    );
    expect(byIdResult).toEqual({ error: true, message: expect.any(String) });

    const timeSeriesResult = await tools.getTimeSeries?.execute?.(
      { bucket: "day" },
      { toolCallId: "t4", messages: [] },
    );
    expect(timeSeriesResult).toEqual({ error: true, message: expect.any(String) });

    const digestResult = await tools.readDigest?.execute?.(
      {},
      { toolCallId: "t5", messages: [] },
    );
    expect(digestResult).toEqual({ error: true, message: expect.any(String) });
  });

  it("should still report { truncated: true } separately from a tool error", async () => {
    const tools = buildFeedbackTools(stubRetriever, () => false);

    const result = await tools.searchFeedback?.execute?.(
      { sentiment: "negative", limit: 10 },
      { toolCallId: "t1", messages: [] },
    );

    expect(result).toEqual({ truncated: true });
  });
});
