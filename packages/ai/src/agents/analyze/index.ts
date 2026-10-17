import { AIError } from "../../errors";
import { openrouterClient } from "../../lib/decisions";
import { type AgentUsage } from "../../lib/usage";
import {
  createGeneration,
  createTrace,
  flushTracing,
  updateGeneration,
} from "../../lib/tracing";

const jevModel = "~typesafe/jev-latest";

const timeoutMs = 30_000;
const maxAttempts = 2;
const retryDelayMs = 500;

const VALID_TAGS = [
  "bug",
  "feature",
  "ux",
  "performance",
  "billing",
  "compliment",
  "support",
] as const;

export type Tag = (typeof VALID_TAGS)[number];

export const SENTIMENT_VALUES = ["positive", "negative", "neutral", "none"] as const;
export type Sentiment = (typeof SENTIMENT_VALUES)[number];

export type FeedbackAnalysis = {
  sentiment: Sentiment;
  tags: Tag[];
};

const jevSentiments = ["positive", "negative", "neutral"] as const;

const questions = {
  sentiment: {
    type: "choice",
    instructions: "What is the overall sentiment of this product feedback?",
    criteria: {
      positive: "The author is satisfied, happy or praising the product",
      negative: "The author is frustrated, dissatisfied or reporting a problem",
      neutral: "The author states facts, asks or suggests without clear emotion",
    },
  },
  category: {
    type: "choice",
    instructions: "Which category best describes this product feedback?",
    criteria: {
      bug: "Something is broken, errors out or behaves incorrectly",
      feature: "A request for new functionality or a missing capability",
      ux: "Confusing, hard to use or poorly designed interface or flow",
      performance: "Slowness, lag, timeouts or resource usage problems",
      billing: "Pricing, payments, invoices, subscriptions or refunds",
      compliment: "Praise or thanks with no actionable request",
      support: "A question or request for help using the product",
    },
  },
} as const;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isMember<T extends string>(values: readonly T[], value: string): value is T {
  return (values as readonly string[]).includes(value);
}

async function attemptAnalysis(
  content: string,
): Promise<{ analysis: FeedbackAnalysis; usage: AgentUsage }> {
  const trace = createTrace({
    name: "analyze-agent",
    metadata: { model: jevModel },
    input: { content: content.slice(0, 500) },
  });

  const response = await openrouterClient.alpha.decisions.create(
    { decisionsRequest: { model: jevModel, state: content, questions } },
    { timeoutMs },
  );

  const sentimentAnswer = response.answers.sentiment;
  const categoryAnswer = response.answers.category;

  if (
    sentimentAnswer?.type !== "choice" ||
    categoryAnswer?.type !== "choice" ||
    !isMember(jevSentiments, sentimentAnswer.choice) ||
    !isMember(VALID_TAGS, categoryAnswer.choice)
  ) {
    throw new AIError("GENERATION_FAILED", "Unexpected Jev decision answers");
  }

  const analysis: FeedbackAnalysis = {
    sentiment: sentimentAnswer.choice,
    tags: [categoryAnswer.choice],
  };

  const usage: AgentUsage = {
    model: response.model,
    inputTokens: response.usage.inputTokens,
    outputTokens: response.usage.outputTokens,
    costMicroUsd: Math.round((response.usage.cost ?? 0) * 1_000_000),
    cacheHit: false,
  };

  try {
    const tokens = {
      inputTokens: usage.inputTokens,
      outputTokens: usage.outputTokens,
      totalTokens: usage.inputTokens + usage.outputTokens,
    };
    const generation = createGeneration(trace, {
      name: "analyze-generation",
      model: response.model,
      input: { content: content.slice(0, 500), questions: Object.keys(questions) },
      output: analysis,
      usage: tokens,
    });
    updateGeneration(generation, analysis, tokens);
    await flushTracing();
  } catch (tracingError) {
    console.error("[echo:ai] analyze tracing failed", tracingError);
  }

  return { analysis, usage };
}

export async function analyzeFeedback(
  content: string,
): Promise<{ analysis: FeedbackAnalysis; usage: AgentUsage }> {
  let lastError: unknown = undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await attemptAnalysis(content);
    } catch (error) {
      lastError = error;
      if (attempt < maxAttempts) await sleep(retryDelayMs);
    }
  }

  if (lastError instanceof AIError) throw lastError;
  throw new AIError("GENERATION_FAILED", "Feedback analysis failed", { cause: lastError });
}
