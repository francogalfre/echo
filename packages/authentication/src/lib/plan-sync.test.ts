import { describe, expect, it } from "vitest";
import type { CustomerStateSubscription } from "@polar-sh/sdk/models/components/customerstatesubscription";

import { resolvePlanFromSubscriptions } from "./plan-sync";

const PRO_PRODUCT_ID = "prod_pro_123";

function buildSubscription(
  overrides: Partial<CustomerStateSubscription>,
): CustomerStateSubscription {
  return {
    id: "sub_1",
    createdAt: new Date(),
    modifiedAt: null,
    metadata: {},
    status: "active",
    amount: 1000,
    currency: "usd",
    recurringInterval: "month",
    currentPeriodStart: new Date(),
    currentPeriodEnd: new Date(),
    trialStart: null,
    trialEnd: null,
    cancelAtPeriodEnd: false,
    canceledAt: null,
    startedAt: new Date(),
    endsAt: null,
    productId: PRO_PRODUCT_ID,
    discountId: null,
    meters: [],
    ...overrides,
  } as CustomerStateSubscription;
}

describe("resolvePlanFromSubscriptions", () => {
  it("should return pro when an active subscription matches the pro product", () => {
    const subscriptions = [buildSubscription({ productId: PRO_PRODUCT_ID })];

    expect(resolvePlanFromSubscriptions(subscriptions, PRO_PRODUCT_ID)).toBe("pro");
  });

  it("should return free when there are no subscriptions", () => {
    expect(resolvePlanFromSubscriptions([], PRO_PRODUCT_ID)).toBe("free");
  });

  it("should return free when subscriptions exist but none match the pro product", () => {
    const subscriptions = [buildSubscription({ productId: "prod_other_456" })];

    expect(resolvePlanFromSubscriptions(subscriptions, PRO_PRODUCT_ID)).toBe("free");
  });
});
