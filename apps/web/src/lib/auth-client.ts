import { env } from "@echo/env/web";
import { polarClient } from "@polar-sh/better-auth/client";
import { lastLoginMethodClient, organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { reset } from "@/lib/posthog";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_SERVER_URL,
  plugins: [organizationClient(), lastLoginMethodClient(), polarClient()],
});

export const { signIn, signUp, useSession } = authClient;

export async function signOut(): Promise<void> {
  await authClient.signOut();
  reset();
}
