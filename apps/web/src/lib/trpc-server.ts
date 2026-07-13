import type { AppRouter } from "@echo/api";
import { env } from "@echo/env/web";
import { createTRPCClient, httpLink } from "@trpc/client";
import { cookies } from "next/headers";

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
      httpLink({
        url: `${env.NEXT_PUBLIC_SERVER_URL}/trpc`,
        headers: () => ({ cookie: cookieHeader }),
        fetch: (url, options) => fetch(url, { ...options, credentials: "include" }),
      }),
    ],
  });
}
