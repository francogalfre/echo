import { beforeEach, describe, expect, it, vi } from "vitest";

const create = vi.hoisted(() => vi.fn());

vi.mock("../../../lib/decisions", () => ({
  openrouterClient: { alpha: { decisions: { create } } },
}));
vi.mock("../../../lib/tracing", () => ({
  createTrace: () => null,
  createGeneration: () => null,
  updateGeneration: () => undefined,
  flushTracing: async () => undefined,
}));

import { AIError } from "../../../errors";
import { analyzeFeedback } from "../index";

function decisionResponse(sentiment: string, category: string) {
  return {
    model: "typesafe/jev-1.13.0",
    usage: { inputTokens: 40, outputTokens: 0, cost: 0.000002 },
    answers: {
      sentiment: { type: "choice", choice: sentiment },
      category: { type: "choice", choice: category },
    },
  };
}

describe("analyzeFeedback", () => {
  beforeEach(() => {
    create.mockReset();
  });

  it("should map jev choices to sentiment, a single tag and usage", async () => {
    create.mockResolvedValue(decisionResponse("negative", "bug"));

    const { analysis, usage } = await analyzeFeedback("The app crashes on login");

    expect(analysis).toEqual({ sentiment: "negative", tags: ["bug"] });
    expect(usage).toEqual({
      model: "typesafe/jev-1.13.0",
      inputTokens: 40,
      outputTokens: 0,
      costMicroUsd: 2,
      cacheHit: false,
    });
    expect(create.mock.calls[0]?.[0].decisionsRequest.state).toBe(
      "The app crashes on login",
    );
  });

  it("should retry once and succeed after a transient failure", async () => {
    create
      .mockRejectedValueOnce(new Error("network"))
      .mockResolvedValueOnce(decisionResponse("positive", "compliment"));

    const { analysis } = await analyzeFeedback("Love it");

    expect(create).toHaveBeenCalledTimes(2);
    expect(analysis.tags).toEqual(["compliment"]);
  });

  it("should throw AIError after exhausting retries", async () => {
    create.mockRejectedValue(new Error("network"));

    await expect(analyzeFeedback("x")).rejects.toBeInstanceOf(AIError);
    expect(create).toHaveBeenCalledTimes(2);
  });

  it("should reject an unknown category choice", async () => {
    create.mockResolvedValue(decisionResponse("neutral", "other"));

    await expect(analyzeFeedback("x")).rejects.toMatchObject({ code: "GENERATION_FAILED" });
  });

  it("should reject an unknown sentiment choice", async () => {
    create.mockResolvedValue(decisionResponse("angry", "bug"));

    await expect(analyzeFeedback("x")).rejects.toBeInstanceOf(AIError);
  });
});
