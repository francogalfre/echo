import { env } from "@echo/env/server";

export const DEFAULT_MODEL = env.OPENROUTER_MODEL ?? "openrouter/free";
