import { PgDialect } from "drizzle-orm/pg-core";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockFindMany = vi.fn();
const mockWhere = vi.fn();
const mockFrom = vi.fn(() => ({ where: mockWhere }));
const mockSelect = vi.fn(() => ({ from: mockFrom }));

vi.mock("@echo/db", () => ({
  db: {
    query: { feedback: { findMany: mockFindMany } },
    select: mockSelect,
  },
}));

const { countFeedbackBySentiment, listFeedback } = await import("./feedback");

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
});
