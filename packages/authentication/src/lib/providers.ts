import { env } from "@echo/env/server";
import type { BetterAuthOptions } from "better-auth";

export const socialProviders: BetterAuthOptions["socialProviders"] = {
  google: {
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
  },
  github: {
    clientId: env.GITHUB_CLIENT_ID,
    clientSecret: env.GITHUB_CLIENT_SECRET,
  },
};
