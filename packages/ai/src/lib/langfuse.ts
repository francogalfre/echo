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

  const baseUrl = env.LANGFUSE_BASEURL || env.LANGFUSE_BASE_URL || LANGFUSE_CLOUD;

  // Diagnostic log so users can verify exact URL and key format
  // eslint-disable-next-line no-console
  console.log(
    "[Langfuse] Using baseUrl:",
    baseUrl,
    "| publicKey prefix:",
    publicKey.slice(0, 10),
    "| secretKey prefix:",
    secretKey.slice(0, 10),
  );

  client = new Langfuse({
    publicKey,
    secretKey,
    baseUrl,
  });

  return client;
}

export async function flushLangfuse(): Promise<void> {
  if (!client) return;

  // eslint-disable-next-line no-console
  console.log("[Langfuse] Flushing traces...");

  try {
    // flush() sends pending events without destroying the client (faster than shutdownAsync)
    await Promise.race([
      (client as unknown as { flush: () => Promise<void> }).flush(),
      new Promise<void>((_, reject) =>
        setTimeout(() => reject(new Error("Langfuse flush timed out after 3s")), 3000),
      ),
    ]);
    // eslint-disable-next-line no-console
    console.log("[Langfuse] Flush complete");
  } catch (flushError) {
    // eslint-disable-next-line no-console
    console.error("[Langfuse] Flush FAILED:", flushError);
  }
}
