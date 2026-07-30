import type { UIMessage } from "ai";

import type { FeedbackRetriever } from "./tools";

export type ChatStreamInput = {
  readonly messages: readonly UIMessage[];
  readonly digestSummary: string | null;
  readonly retriever: FeedbackRetriever;
  readonly spendBudget: (chars: number) => boolean;
};
