import { env } from "@echo/env/server";
import { Langfuse } from "langfuse";

let client: Langfuse | null = null;

export function getLangfuse(): Langfuse | null {
  if (client) return client;

  const publicKey = env.LANGFUSE_PUBLIC_KEY;
  const secretKey = env.LANGFUSE_SECRET_KEY;

  if (!publicKey || !secretKey) {
    // eslint-disable-next-line no-console
    console.log("[Langfuse] Skipped — LANGFUSE_PUBLIC_KEY or LANGFUSE_SECRET_KEY not set");
    return null;
  }

  // eslint-disable-next-line no-console
  console.log("[Langfuse] Initializing with public key:", publicKey.slice(0, 8) + "...");

  client = new Langfuse({
    publicKey,
    secretKey,
    baseUrl: env.LANGFUSE_BASEURL,
  });

  return client;
}

export async function flushLangfuse(): Promise<void> {
  if (client) {
    // eslint-disable-next-line no-console
    console.log("[Langfuse] Flushing traces...");
    await client.shutdownAsync();
    // eslint-disable-next-line no-console
    console.log("[Langfuse] Flush complete");
  }
}
