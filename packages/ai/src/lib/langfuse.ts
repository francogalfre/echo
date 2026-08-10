import { env } from "@echo/env/server";
import { Langfuse } from "langfuse";

let client: Langfuse | null = null;

export function getLangfuse(): Langfuse | null {
  if (client) return client;

  const publicKey = env.LANGFUSE_PUBLIC_KEY;
  const secretKey = env.LANGFUSE_SECRET_KEY;

  if (!publicKey || !secretKey) return null;

  client = new Langfuse({
    publicKey,
    secretKey,
    baseUrl: env.LANGFUSE_BASEURL,
  });

  return client;
}

export async function flushLangfuse(): Promise<void> {
  if (client) {
    await client.shutdownAsync();
  }
}
