import { generateText } from "ai";

import { AIError } from "../../errors";
import { sentimentModel } from "./models";
import { buildSentimentPrompt, SENTIMENT_SYSTEM_PROMPT } from "./prompt";
import { SENTIMENT_VALUES, type Sentiment } from "./types";

const TIMEOUT_MS = 30_000;

function parseSentiment(text: string): Sentiment | undefined {
  const normalized = text.trim().toLowerCase();

  return (
    SENTIMENT_VALUES.find((value) => normalized === value) ??
    SENTIMENT_VALUES.find((value) => normalized.includes(value))
  );
}

async function generate(content: string): Promise<string> {
  try {
    const { text } = await generateText({
      model: sentimentModel,
      system: SENTIMENT_SYSTEM_PROMPT,
      prompt: buildSentimentPrompt(content),
      temperature: 0,
      maxOutputTokens: 8,
      abortSignal: AbortSignal.timeout(TIMEOUT_MS),
    });

    return text;
  } catch (error) {
    throw new AIError("GENERATION_FAILED", "Sentiment classification failed", {
      cause: error,
    });
  }
}

export async function classifySentiment(content: string): Promise<Sentiment> {
  const text = await generate(content);

  const sentiment = parseSentiment(text);
  if (!sentiment) {
    throw new AIError("GENERATION_FAILED", `Unexpected sentiment output: "${text}"`);
  }

  return sentiment;
}
