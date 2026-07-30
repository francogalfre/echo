export type ChatMessage = {
  readonly role: "user" | "assistant";
  readonly content: string;
  readonly timestamp: Date;
};

export type ChatFeedbackContext = {
  readonly content: string;
  readonly sentiment: string;
  readonly tags: readonly string[];
};

export type ChatInput = {
  readonly messages: readonly ChatMessage[];
  readonly feedbackContext: readonly ChatFeedbackContext[];
};

export type ChatOutput = {
  readonly response: string;
  readonly sources: readonly {
    readonly excerpt: string;
    readonly sentiment: string;
  }[];
};
