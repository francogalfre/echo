import { env } from "@echo/env/server";

const FREE_MODEL = "openrouter/free";
const CHEAP_FALLBACK_MODEL = "openai/gpt-5-nano";
const STRONG_FALLBACK_MODEL = "openai/gpt-4.1-mini";

export const AGENT_MODELS = {
  analyze: {
    primary: env.OPENROUTER_MODEL ?? FREE_MODEL,
    fallback: env.OPENROUTER_ANALYZE_FALLBACK_MODEL ?? CHEAP_FALLBACK_MODEL,
  },
  insight: {
    primary: env.OPENROUTER_MODEL ?? FREE_MODEL,
    fallback: env.OPENROUTER_INSIGHT_FALLBACK_MODEL ?? CHEAP_FALLBACK_MODEL,
  },
  chat: {
    primary: env.OPENROUTER_CHAT_MODEL ?? FREE_MODEL,
    fallback: env.OPENROUTER_CHAT_FALLBACK_MODEL ?? STRONG_FALLBACK_MODEL,
  },
  digest: {
    primary: env.OPENROUTER_MODEL ?? FREE_MODEL,
    fallback: env.OPENROUTER_DIGEST_FALLBACK_MODEL ?? STRONG_FALLBACK_MODEL,
  },
} as const;

export type AgentName = keyof typeof AGENT_MODELS;
