import { env } from "@echo/env/server";

export const DEFAULT_MODEL = env.OPENROUTER_MODEL ?? "openrouter/free";
export const CHAT_MODEL = env.OPENROUTER_CHAT_MODEL ?? "openrouter/free";
export const FALLBACK_MODEL =
  env.OPENROUTER_FALLBACK_MODEL ?? "~deepseek/deepseek-v4-flash-latest";
