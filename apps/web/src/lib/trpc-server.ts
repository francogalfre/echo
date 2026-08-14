import type { AppRouter } from "@echo/api";
import { env } from "@echo/env/web";
import { createTRPCClient, httpBatchLink, retryLink } from "@trpc/client";
import { cookies } from "next/headers";

import { isRetryableTrpcError, retryDelayMs } from "./trpc-retry";

export async function createServerTrpc(): Promise<
  ReturnType<typeof createTRPCClient<AppRouter>>
> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  return createTRPCClient<AppRouter>({
    links: [
      retryLink({
        retry: ({ op, error, attempts }) =>
          op.type === "query" && isRetryableTrpcError(error) && attempts < 3,
        retryDelayMs,
      }),
      httpBatchLink({
        url: `${env.NEXT_PUBLIC_SERVER_URL}/trpc`,
        headers: () => ({ cookie: cookieHeader }),
        fetch: (url, options) => fetch(url, { ...options, cache: "no-store" }),
      }),
    ],
  });
}
