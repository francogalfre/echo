import { env } from "@echo/env/server";
import { OpenRouter } from "@openrouter/sdk";

export const openrouterClient = new OpenRouter({ apiKey: env.OPENROUTER_API_KEY });
