import { env } from "@echo/env/server";
import { Langfuse } from "langfuse";

let client: Langfuse | null = null;

const langfuseCloud = "https://cloud.langfuse.com";

export function getLangfuse(): Langfuse | null {
  if (client) return client;

  const publicKey = env.LANGFUSE_PUBLIC_KEY;
  const secretKey = env.LANGFUSE_SECRET_KEY;

  if (!publicKey || !secretKey) {
    return null;
  }

  const baseUrl = env.LANGFUSE_BASEURL || env.LANGFUSE_BASE_URL || langfuseCloud;

  client = new Langfuse({
    publicKey,
    secretKey,
    baseUrl,
  });

  return client;
}

export async function flushLangfuse(): Promise<void> {
  if (!client) return;

  try {
    await Promise.race([
      (client as unknown as { flush: () => Promise<void> }).flush(),
      new Promise<void>((_, reject) =>
        setTimeout(() => reject(new Error("Langfuse flush timed out after 3s")), 3000),
      ),
    ]);
  } catch (flushError) {
    console.error("[Langfuse] Flush failed:", flushError);
  }
}
