export { AIError, type AIErrorCode } from "./errors";

export { analyzeFeedback } from "./agents/analyze";
export { SENTIMENT_VALUES, type FeedbackAnalysis, type Sentiment } from "./agents/analyze";

export { generateInsight } from "./agents/insight";
export type { InsightInput } from "./agents/insight";

export { generateDigest } from "./agents/digest";
export type { DigestInput, DigestOutput, DigestTheme } from "./agents/digest";

export type { UIMessage } from "ai";
export { streamChatResponse, type ChatStreamResult } from "./agents/chat";
export type {
  CachedDigest,
  FeedbackRetriever,
  SearchHit,
  SeriesPoint,
} from "./agents/chat/tools";
