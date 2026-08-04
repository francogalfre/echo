import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CustomerStateSubscription } from "@polar-sh/sdk/models/components/customerstatesubscription";
import type { WebhookCustomerStateChangedPayload } from "@polar-sh/sdk/models/components/webhookcustomerstatechangedpayload";

const mockInsertValues = vi.fn((_values: unknown) => Promise.resolve(undefined));
const mockInsert = vi.fn(() => ({ values: mockInsertValues }));

const mockSelectWhere = vi.fn();
const mockSelectInnerJoin = vi.fn(() => ({ where: mockSelectWhere }));
const mockSelectFrom = vi.fn(() => ({ innerJoin: mockSelectInnerJoin }));
const mockSelect = vi.fn(() => ({ from: mockSelectFrom }));

const mockUpdateWhere = vi.fn((_condition: unknown) => Promise.resolve(undefined));
const mockUpdateSet = vi.fn((_values: unknown) => ({ where: mockUpdateWhere }));
const mockUpdate = vi.fn(() => ({ set: mockUpdateSet }));

vi.mock("@echo/db", () => ({
  db: {
    insert: mockInsert,
    select: mockSelect,
    update: mockUpdate,
  },
}));

const { notifyMemberJoined, resolvePlanFromSubscriptions, syncPlanFromCustomerState } =
  await import("./plan-sync");

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

describe("notifyMemberJoined", () => {
  beforeEach(() => {
    mockInsert.mockClear();
    mockInsertValues.mockClear();
  });

  it("should insert a member.joined notification linking to the team settings page", async () => {
    await notifyMemberJoined({
      member: { organizationId: "org_1" },
      user: { name: "Ada" },
      organization: { name: "Acme" },
    });

    const values = mockInsertValues.mock.calls[0]?.[0] as Record<string, unknown>;

    expect(values.organizationId).toBe("org_1");
    expect(values.type).toBe("member.joined");
    expect(values.title).toBe("Ada joined Acme");
    expect(values.link).toBe("/dashboard/settings/team");
  });
});

function buildPayload(
  overrides: Partial<WebhookCustomerStateChangedPayload["data"]>,
): WebhookCustomerStateChangedPayload {
  return {
    type: "customer.state_changed",
    data: {
      externalId: "user_1",
      activeSubscriptions: [],
      ...overrides,
    },
  } as WebhookCustomerStateChangedPayload;
}

describe("syncPlanFromCustomerState", () => {
  beforeEach(() => {
    mockInsert.mockClear();
    mockInsertValues.mockClear();
    mockSelect.mockClear();
    mockSelectFrom.mockClear();
    mockSelectInnerJoin.mockClear();
    mockSelectWhere.mockReset().mockResolvedValue([]);
    mockUpdate.mockClear();
    mockUpdateSet.mockClear();
    mockUpdateWhere.mockClear();
  });

  it("should insert a plan.upgraded notification linking to billing when an owned org upgrades", async () => {
    mockSelectWhere.mockResolvedValue([{ id: "org_1", plan: "free" }]);

    await syncPlanFromCustomerState(
      buildPayload({
        activeSubscriptions: [
          { productId: "test-polar-pro-product-id" },
        ] as unknown as WebhookCustomerStateChangedPayload["data"]["activeSubscriptions"],
      }),
    );

    const values = mockInsertValues.mock.calls[0]?.[0] as Record<string, unknown>[];

    expect(values[0]?.organizationId).toBe("org_1");
    expect(values[0]?.type).toBe("plan.upgraded");
    expect(values[0]?.link).toBe("/dashboard/settings/billing");
  });

  it("should not insert a notification when no owned org is upgraded", async () => {
    mockSelectWhere.mockResolvedValue([{ id: "org_1", plan: "pro" }]);

    await syncPlanFromCustomerState(
      buildPayload({
        activeSubscriptions: [
          { productId: "test-polar-pro-product-id" },
        ] as unknown as WebhookCustomerStateChangedPayload["data"]["activeSubscriptions"],
      }),
    );

    expect(mockInsert).not.toHaveBeenCalled();
  });
});
