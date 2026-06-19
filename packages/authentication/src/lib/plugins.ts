import { env } from "@echo/env/server";
import { checkout, polar, portal } from "@polar-sh/better-auth";
import { lastLoginMethod, organization } from "better-auth/plugins";

import { polarClient } from "./payments";

export const plugins = [
  polar({
    client: polarClient,
    createCustomerOnSignUp: true,
    enableCustomerPortal: true,
    use: [
      checkout({
        products: [
          {
            productId: "your-product-id",
            slug: "pro",
          },
        ],
        successUrl: env.POLAR_SUCCESS_URL,
        authenticatedUsersOnly: true,
      }),
      portal(),
    ],
  }),
  organization({
    organizationLimit: 1,
    creatorRole: "owner",
  }),
  lastLoginMethod(),
];
