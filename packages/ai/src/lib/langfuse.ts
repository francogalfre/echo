import { env } from "@echo/env/server";
import { Langfuse } from "langfuse";

let client: Langfuse | null = null;

const LANGFUSE_CLOUD = "https://cloud.langfuse.com";

export function getLangfuse(): Langfuse | null {
  if (client) return client;

  const publicKey = env.LANGFUSE_PUBLIC_KEY;
  const secretKey = env.LANGFUSE_SECRET_KEY;

  if (!publicKey || !secretKey) {
    return null;
  }

  const baseUrl = env.LANGFUSE_BASEURL || LANGFUSE_CLOUD;

  client = new Langfuse({
    publicKey,
    secretKey,
    baseUrl,
  });

  return client;
}

export async function flushLangfuse(): Promise<void> {
  if (client) {
    await client.shutdownAsync();
  }
}
