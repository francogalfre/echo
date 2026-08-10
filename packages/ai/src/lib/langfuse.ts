import { env } from "@echo/env/server";
import { Langfuse } from "langfuse";

let client: Langfuse | null = null;

export function getLangfuse(): Langfuse | null {
  if (client) return client;

  const publicKey = env.LANGFUSE_PUBLIC_KEY;
  const secretKey = env.LANGFUSE_SECRET_KEY;

  // Debug: always log what we see so users know if keys are missing
  // eslint-disable-next-line no-console
  console.log(
    "[Langfuse] env.LANGFUSE_PUBLIC_KEY present?",
    !!publicKey,
    "env.LANGFUSE_SECRET_KEY present?",
    !!secretKey,
  );

  if (!publicKey || !secretKey) {
    // eslint-disable-next-line no-console
    console.warn(
      `[Langfuse] Skipped — LANGFUSE_PUBLIC_KEY or LANGFUSE_SECRET_KEY not set.\n` +
        `Make sure these are in the .env file that the server loads (usually at the monorepo root, not apps/server/.env).\n` +
        `Current CWD: ${process.cwd()}`,
    );
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
