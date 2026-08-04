import type { SQL } from "drizzle-orm";
import { PgDialect } from "drizzle-orm/pg-core";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockInsertValues = vi.fn((_values: unknown) => Promise.resolve(undefined));
const mockInsert = vi.fn(() => ({ values: mockInsertValues }));

const mockFindMany = vi.fn();

const mockSelectWhere = vi.fn();
const mockSelectFrom = vi.fn(() => ({ where: mockSelectWhere }));
const mockSelect = vi.fn(() => ({ from: mockSelectFrom }));

const mockUpdateWhere = vi.fn((_condition: SQL<unknown>) => Promise.resolve(undefined));
const mockUpdateSet = vi.fn((_values: unknown) => ({ where: mockUpdateWhere }));
const mockUpdate = vi.fn(() => ({ set: mockUpdateSet }));

vi.mock("@echo/db", () => ({
  db: {
    insert: mockInsert,
    query: { notifications: { findMany: mockFindMany } },
    select: mockSelect,
    update: mockUpdate,
  },
}));

const {
  countUnreadNotifications,
  insertNotification,
  listNotifications,
  markNotificationsRead,
} = await import("../notifications");

const dialect = new PgDialect();
const ORG_ID = "org_1";

describe("insertNotification", () => {
  beforeEach(() => {
    mockInsert.mockClear();
    mockInsertValues.mockClear();
  });

  it("should insert with the given organizationId, type and title", async () => {
    await insertNotification({
      organizationId: ORG_ID,
      type: "feedback.received",
      title: "New feedback from Ada",
      body: "Great product",
    });

    const values = mockInsertValues.mock.calls[0]?.[0] as Record<string, unknown>;

    expect(values.organizationId).toBe(ORG_ID);
    expect(values.type).toBe("feedback.received");
    expect(values.title).toBe("New feedback from Ada");
    expect(values.body).toBe("Great product");
    expect(typeof values.id).toBe("string");
  });

  it("should insert the link when provided", async () => {
    await insertNotification({
      organizationId: ORG_ID,
      type: "feedback.received",
      title: "New feedback from Ada",
      link: "/dashboard/feedback?feedback=fb_1",
    });

    const values = mockInsertValues.mock.calls[0]?.[0] as Record<string, unknown>;

    expect(values.link).toBe("/dashboard/feedback?feedback=fb_1");
  });

  it("should leave the link undefined when not provided", async () => {
    await insertNotification({
      organizationId: ORG_ID,
      type: "member.joined",
      title: "Ada joined Acme",
    });

    const values = mockInsertValues.mock.calls[0]?.[0] as Record<string, unknown>;

    expect(values.link).toBeUndefined();
  });
});

describe("listNotifications", () => {
  beforeEach(() => {
    mockFindMany.mockReset();
    mockFindMany.mockResolvedValue([]);
  });

  it("should scope the query to organization and order by created_at desc", async () => {
    await listNotifications(ORG_ID, 20);

    const call = mockFindMany.mock.calls[0]?.[0];
    const whereQuery = dialect.sqlToQuery(call.where);
    const orderQuery = dialect.sqlToQuery(call.orderBy[0]);

    expect(whereQuery.sql).toContain('"notifications"."organization_id" = $1');
    expect(whereQuery.params).toEqual([ORG_ID]);
    expect(orderQuery.sql).toContain('"notifications"."created_at" desc');
  });

  it("should pass the limit through to the query", async () => {
    await listNotifications(ORG_ID, 5);

    const call = mockFindMany.mock.calls[0]?.[0];

    expect(call.limit).toBe(5);
  });
});

describe("countUnreadNotifications", () => {
  beforeEach(() => {
    mockSelect.mockClear();
    mockSelectFrom.mockClear();
    mockSelectWhere.mockReset();
  });

  it("should scope to organization and unread notifications", async () => {
    mockSelectWhere.mockResolvedValue([{ count: 2 }]);

    await countUnreadNotifications(ORG_ID);

    const call = mockSelectWhere.mock.calls[0]?.[0];
    const query = dialect.sqlToQuery(call);

    expect(query.sql).toContain('"notifications"."organization_id" = $1');
    expect(query.sql).toContain('"notifications"."read_at" is null');
    expect(query.params).toEqual([ORG_ID]);
  });

  it("should return the count from the aggregate row", async () => {
    mockSelectWhere.mockResolvedValue([{ count: 4 }]);

    const result = await countUnreadNotifications(ORG_ID);

    expect(result).toBe(4);
  });

  it("should fall back to zero when no row is returned", async () => {
    mockSelectWhere.mockResolvedValue([]);

    const result = await countUnreadNotifications(ORG_ID);

    expect(result).toBe(0);
  });
});

describe("markNotificationsRead", () => {
  beforeEach(() => {
    mockUpdate.mockClear();
    mockUpdateSet.mockClear();
    mockUpdateWhere.mockClear();
  });

  it("should set read_at and scope the update to organization and unread notifications", async () => {
    await markNotificationsRead(ORG_ID);

    const setArg = mockUpdateSet.mock.calls[0]?.[0] as { readAt: Date };
    expect(setArg.readAt).toBeInstanceOf(Date);

    const call = mockUpdateWhere.mock.calls[0]?.[0] as SQL<unknown>;
    const query = dialect.sqlToQuery(call);

    expect(query.sql).toContain('"notifications"."organization_id" = $1');
    expect(query.sql).toContain('"notifications"."read_at" is null');
    expect(query.params).toEqual([ORG_ID]);
  });
});
