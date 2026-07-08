import { env } from "@echo/env/server";
import { checkout, polar, portal, webhooks } from "@polar-sh/better-auth";
import { lastLoginMethod, organization } from "better-auth/plugins";

import { polarClient } from "./payments";
import {
  hasReachedOrganizationLimit,
  inheritPlanForNewOrganization,
  syncPlanFromCustomerState,
} from "./plan-sync";

export const plugins = [
  polar({
    client: polarClient,
    createCustomerOnSignUp: true,
    enableCustomerPortal: true,
    use: [
      checkout({
        products: [
          {
            productId: env.POLAR_PRO_PRODUCT_ID,
            slug: "pro",
          },
        ],
        successUrl: env.POLAR_SUCCESS_URL,
        authenticatedUsersOnly: true,
      }),
      portal(),
      webhooks({
        secret: env.POLAR_WEBHOOK_SECRET,
        onCustomerStateChanged: syncPlanFromCustomerState,
      }),
    ],
  }),
  organization({
    organizationLimit: hasReachedOrganizationLimit,
    creatorRole: "owner",
    organizationHooks: {
      afterCreateOrganization: inheritPlanForNewOrganization,
    },
  }),
  lastLoginMethod(),
];
