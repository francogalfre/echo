import type { AppRouter } from "@echo/api";
import { env } from "@echo/env/web";
import { createTRPCClient, httpLink } from "@trpc/client";

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpLink({
      url: `${env.NEXT_PUBLIC_SERVER_URL}/trpc`,
      fetch: (url, options) => fetch(url, { ...options, credentials: "include" }),
    }),
  ],
});
