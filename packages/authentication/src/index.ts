import { createDb } from "@echo/db";
import * as schema from "@echo/db/schema/auth";
import { env } from "@echo/env/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { asc, eq } from "drizzle-orm";

import { plugins } from "./lib/plugins";
import { socialProviders } from "./lib/providers";

export function createAuth() {
  const db = createDb();

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",
      schema,
    }),
    databaseHooks: {
      session: {
        create: {
          before: async (session) => {
            const membership = await db.query.member.findFirst({
              where: eq(schema.member.userId, session.userId),
              orderBy: [asc(schema.member.createdAt), asc(schema.member.id)],
              columns: { organizationId: true },
            });

            return {
              data: {
                ...session,
                activeOrganizationId: membership?.organizationId ?? null,
              },
            };
          },
        },
      },
    },
    trustedOrigins: [env.CORS_ORIGIN],
    emailAndPassword: {
      enabled: true,
    },
    socialProviders,
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    advanced: {
      ...(env.NODE_ENV === "production" && {
        crossSubDomainCookies: {
          enabled: true,
          domain: `.${new URL(env.CORS_ORIGIN).hostname}`,
        },
      }),
      defaultCookieAttributes: {
        sameSite: "none",
        secure: true,
        httpOnly: true,
      },
    },
    plugins,
  });
}

export const auth = createAuth();
