export const VALID_TAGS = [
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
