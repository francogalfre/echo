import { db } from "@echo/db";
import { member, organization } from "@echo/db/schema/auth";
import { notifications } from "@echo/db/schema/notifications";
import { env } from "@echo/env/server";
import { and, eq, inArray } from "drizzle-orm";
import type { CustomerStateSubscription } from "@polar-sh/sdk/models/components/customerstatesubscription";
import type { WebhookCustomerStateChangedPayload } from "@polar-sh/sdk/models/components/webhookcustomerstatechangedpayload";

const FREE_ORG_LIMIT = 1;
const PRO_ORG_LIMIT = 5;

type OwnedOrganization = { id: string; plan: string };

function getOwnedOrganizations(userId: string): Promise<OwnedOrganization[]> {
  return db
    .select({ id: organization.id, plan: organization.plan })
    .from(organization)
    .innerJoin(member, eq(member.organizationId, organization.id))
    .where(and(eq(member.userId, userId), eq(member.role, "owner")));
}

export function resolvePlanFromSubscriptions(
  subscriptions: readonly CustomerStateSubscription[],
  proProductId: string,
): "pro" | "free" {
  const hasActivePro = subscriptions.some(
    (subscription) => subscription.productId === proProductId,
  );

  return hasActivePro ? "pro" : "free";
}

export async function syncPlanFromCustomerState(
  payload: WebhookCustomerStateChangedPayload,
): Promise<void> {
  const externalId = payload.data.externalId;
  if (!externalId) return;

  const plan = resolvePlanFromSubscriptions(
    payload.data.activeSubscriptions,
    env.POLAR_PRO_PRODUCT_ID,
  );

  const owned = await getOwnedOrganizations(externalId);
  if (owned.length === 0) return;

  const upgradedOrgIds = owned
    .filter((org) => org.plan !== "pro" && plan === "pro")
    .map((org) => org.id);

  if (upgradedOrgIds.length > 0) {
    await db.insert(notifications).values(
      upgradedOrgIds.map((organizationId) => ({
        id: crypto.randomUUID(),
        organizationId,
        type: "plan.upgraded",
        title: "Welcome to Pro",
        body: "Thanks for subscribing — unlimited feedback and higher AI limits are now unlocked.",
      })),
    );
  }

  await db
    .update(organization)
    .set({ plan })
    .where(
      inArray(
        organization.id,
        owned.map((org) => org.id),
      ),
    );
}

export async function hasReachedOrganizationLimit(user: { id: string }): Promise<boolean> {
  const owned = await getOwnedOrganizations(user.id);
  const limit = owned.some((org) => org.plan === "pro") ? PRO_ORG_LIMIT : FREE_ORG_LIMIT;

  return owned.length >= limit;
}

export async function inheritPlanForNewOrganization(data: {
  organization: { id: string };
  user: { id: string };
}): Promise<void> {
  const owned = await getOwnedOrganizations(data.user.id);
  const isPro = owned.some((org) => org.id !== data.organization.id && org.plan === "pro");
  if (!isPro) return;

  await db
    .update(organization)
    .set({ plan: "pro" })
    .where(eq(organization.id, data.organization.id));
}

export async function notifyMemberJoined(data: {
  member: { organizationId: string };
  user: { name: string };
  organization: { name: string };
}): Promise<void> {
  await db.insert(notifications).values({
    id: crypto.randomUUID(),
    organizationId: data.member.organizationId,
    type: "member.joined",
    title: `${data.user.name} joined ${data.organization.name}`,
  });
}
