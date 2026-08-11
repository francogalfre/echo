import type { AppRouter } from "@echo/api";
import { env } from "@echo/env/web";
import { createTRPCClient, httpBatchLink, retryLink } from "@trpc/client";

import { isRetryableTrpcError, retryDelayMs } from "./trpc-retry";

export const trpc = createTRPCClient<AppRouter>({
  links: [
    retryLink({
      retry: ({ op, error, attempts }) =>
        op.type === "query" && isRetryableTrpcError(error) && attempts < 3,
      retryDelayMs,
    }),
    httpBatchLink({
      url: `${env.NEXT_PUBLIC_SERVER_URL}/trpc`,
      fetch: (url, options) => fetch(url, { ...options, credentials: "include" }),
    }),
  ],
});
