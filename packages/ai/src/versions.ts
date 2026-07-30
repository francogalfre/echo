import { PROMPT_VERSION as ANALYZE_PROMPT_VERSION } from "./agents/analyze/prompt";
import { PROMPT_VERSION as CHAT_PROMPT_VERSION } from "./agents/chat/prompt";
import { PROMPT_VERSION as DIGEST_PROMPT_VERSION } from "./agents/digest/prompt";
import { PROMPT_VERSION as INSIGHT_PROMPT_VERSION } from "./agents/insight/prompt";

export const AGENT_VERSIONS = {
  analyze: ANALYZE_PROMPT_VERSION,
  chat: CHAT_PROMPT_VERSION,
  digest: DIGEST_PROMPT_VERSION,
  insight: INSIGHT_PROMPT_VERSION,
} as const;

export type AgentName = keyof typeof AGENT_VERSIONS;
