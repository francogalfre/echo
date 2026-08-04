import { feedback } from "@echo/db/schema/feedback";
import type { SQL } from "drizzle-orm";
import { PgDialect } from "drizzle-orm/pg-core";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockFindMany = vi.fn();
const mockFindFirst = vi.fn();
const mockWhere = vi.fn();
const mockFrom = vi.fn(() => ({ where: mockWhere }));
const mockSelect = vi.fn(() => ({ from: mockFrom }));

const mockReturning = vi.fn();
const mockDeleteWhere = vi.fn((_condition: SQL<unknown>) => ({ returning: mockReturning }));
const mockDelete = vi.fn(() => ({ where: mockDeleteWhere }));

vi.mock("@echo/db", () => ({
  db: {
    query: { feedback: { findMany: mockFindMany, findFirst: mockFindFirst } },
    select: mockSelect,
    delete: mockDelete,
  },
}));

const { countFeedbackBySentiment, getFeedbackListItemById, listFeedback } =
  await import("../feedback/queries");
const { deleteFeedback } = await import("../feedback/mutations");

const dialect = new PgDialect();
const ORG_ID = "org_1";

describe("listFeedback", () => {
  beforeEach(() => {
    mockFindMany.mockReset();
    mockFindMany.mockResolvedValue([]);
  });

  it("should compose sentiment, source and search into a single where clause", async () => {
    await listFeedback(ORG_ID, {
      sentiment: "positive",
      source: "widget",
      search: "bob",
      limit: 10,
      offset: 0,
    });

    const call = mockFindMany.mock.calls[0]?.[0];
    const query = dialect.sqlToQuery(call.where);

    expect(query.sql).toContain('"feedback"."organization_id" = $1');
    expect(query.sql).toContain('"feedback"."sentiment" = $2');
    expect(query.sql).toContain('"feedback"."source" = $3');
    expect(query.sql).toContain('"feedback"."author_name" ilike $4');
    expect(query.sql).toContain('"feedback"."content" ilike $5');
    expect(query.params).toEqual([ORG_ID, "positive", "widget", "%bob%", "%bob%"]);
  });

  it("should filter by organization only when no optional filters are given", async () => {
    await listFeedback(ORG_ID, { limit: 10, offset: 0 });

    const call = mockFindMany.mock.calls[0]?.[0];
    const query = dialect.sqlToQuery(call.where);

    expect(query.sql).toBe('"feedback"."organization_id" = $1');
    expect(query.params).toEqual([ORG_ID]);
  });

  it("should pass limit and offset through to the query", async () => {
    await listFeedback(ORG_ID, { limit: 25, offset: 50 });

    const call = mockFindMany.mock.calls[0]?.[0];

    expect(call.limit).toBe(25);
    expect(call.offset).toBe(50);
  });
});

describe("getFeedbackListItemById", () => {
  beforeEach(() => {
    mockFindFirst.mockReset();
  });

  it("should return the mapped item when it belongs to the organization", async () => {
    mockFindFirst.mockResolvedValue({
      id: "fb_1",
      organizationId: ORG_ID,
      authorName: "Ada",
      content: "Great product",
      email: "ada@example.com",
      rating: 5,
      source: "widget",
      sentiment: "positive",
      tags: ["ui"],
      insight: "Loves the product",
      createdAt: new Date("2026-01-01"),
    });

    const result = await getFeedbackListItemById(ORG_ID, "fb_1");

    expect(result).toEqual({
      id: "fb_1",
      name: "Ada",
      feedback: "Great product",
      email: "ada@example.com",
      rating: 5,
      source: "widget",
      sentiment: "positive",
      tags: ["ui"],
      hasInsight: true,
      createdAt: new Date("2026-01-01"),
    });
  });

  it("should scope the lookup to both the id and the organization", async () => {
    mockFindFirst.mockResolvedValue(undefined);

    await getFeedbackListItemById(ORG_ID, "fb_1");

    const call = mockFindFirst.mock.calls[0]?.[0];
    const query = dialect.sqlToQuery(call.where(feedback));

    expect(query.sql).toContain('"feedback"."id" = $1');
    expect(query.sql).toContain('"feedback"."organization_id" = $2');
    expect(query.params).toEqual(["fb_1", ORG_ID]);
  });

  it("should return null when the item belongs to another organization", async () => {
    mockFindFirst.mockResolvedValue(undefined);

    const result = await getFeedbackListItemById(ORG_ID, "fb_1");

    expect(result).toBeNull();
  });
});

describe("countFeedbackBySentiment", () => {
  beforeEach(() => {
    mockSelect.mockClear();
    mockFrom.mockClear();
    mockWhere.mockReset();
  });

  it("should return the four sentiment buckets from the aggregate row", async () => {
    mockWhere.mockResolvedValue([{ all: 10, positive: 4, neutral: 3, negative: 3 }]);

    const result = await countFeedbackBySentiment(ORG_ID);

    expect(result).toEqual({ all: 10, positive: 4, neutral: 3, negative: 3 });
  });

  it("should fall back to zeros when no row is returned", async () => {
    mockWhere.mockResolvedValue([]);

    const result = await countFeedbackBySentiment(ORG_ID);

    expect(result).toEqual({ all: 0, positive: 0, neutral: 0, negative: 0 });
  });

  it("should apply source and search filters to the aggregate query", async () => {
    mockWhere.mockResolvedValue([{ all: 2, positive: 1, neutral: 1, negative: 0 }]);

    await countFeedbackBySentiment(ORG_ID, { source: "widget", search: "bob" });

    const call = mockWhere.mock.calls[0]?.[0];
    const query = dialect.sqlToQuery(call);

    expect(query.sql).toContain('"feedback"."organization_id" = $1');
    expect(query.sql).toContain('"feedback"."source" = $2');
    expect(query.sql).toContain('"feedback"."author_name" ilike $3');
    expect(query.sql).toContain('"feedback"."content" ilike $4');
    expect(query.params).toEqual([ORG_ID, "widget", "%bob%", "%bob%"]);
  });
});

describe("deleteFeedback", () => {
  beforeEach(() => {
    mockDelete.mockClear();
    mockDeleteWhere.mockClear();
    mockReturning.mockReset();
  });

  it("should scope the delete to organization and the given ids", async () => {
    mockReturning.mockResolvedValue([{ id: "fb_1" }, { id: "fb_2" }]);

    await deleteFeedback(["fb_1", "fb_2"], ORG_ID);

    const call = mockDeleteWhere.mock.calls[0]?.[0];
    const query = dialect.sqlToQuery(call as SQL<unknown>);

    expect(query.sql).toContain('"feedback"."organization_id" = $1');
    expect(query.sql).toContain('"feedback"."id" in ($2, $3)');
    expect(query.params).toEqual([ORG_ID, "fb_1", "fb_2"]);
  });

  it("should return the number of rows deleted", async () => {
    mockReturning.mockResolvedValue([{ id: "fb_1" }, { id: "fb_2" }, { id: "fb_3" }]);

    const result = await deleteFeedback(["fb_1", "fb_2", "fb_3"], ORG_ID);

    expect(result).toBe(3);
  });
});
