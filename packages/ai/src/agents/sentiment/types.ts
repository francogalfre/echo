export const SENTIMENT_VALUES = ["positive", "negative", "neutral", "none"] as const;

export type Sentiment = (typeof SENTIMENT_VALUES)[number];
