import { env } from "@echo/env/web";
import { lastLoginMethodClient, organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_SERVER_URL,
  plugins: [organizationClient(), lastLoginMethodClient()],
});

export const { signIn, signUp, signOut, useSession } = authClient;
