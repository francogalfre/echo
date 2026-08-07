import { env } from "@echo/env/server";
import { checkout, polar, portal, webhooks } from "@polar-sh/better-auth";
import { lastLoginMethod, organization } from "better-auth/plugins";

import { sendInvitationEmail } from "./invitation-email";
import {
  notifyMemberJoined,
  notifyOrganizationCreated,
} from "./organization-notifications";
import { polarClient } from "./payments";
import {
  hasReachedOrganizationLimit,
  inheritPlanForNewOrganization,
  syncPlanFromCustomerState,
} from "./plan-sync";

async function afterCreateOrganization(data: {
  organization: { id: string; name: string };
  user: { id: string };
}): Promise<void> {
  await Promise.all([inheritPlanForNewOrganization(data), notifyOrganizationCreated(data)]);
}

export const plugins = [
  polar({
    client: polarClient,
    createCustomerOnSignUp: false,
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
      afterCreateOrganization,
      afterAddMember: notifyMemberJoined,
    },
    sendInvitationEmail,
  }),
  lastLoginMethod(),
];
