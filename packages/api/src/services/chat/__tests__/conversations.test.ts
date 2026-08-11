import { chatMessages } from "@echo/db/schema/chat";
import type { SQL } from "drizzle-orm";
import { PgDialect } from "drizzle-orm/pg-core";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockFindMany = vi.fn();

vi.mock("@echo/db", () => ({
  db: {
    query: { chatMessages: { findMany: mockFindMany } },
  },
}));

const { listMessages } = await import("../conversations");

const dialect = new PgDialect();
const ORG_ID = "org_1";
const CONVERSATION_ID = "conv_1";

function row(seq: number) {
  return {
    id: `msg_${seq}`,
    role: seq % 2 === 0 ? "assistant" : "user",
    parts: [{ type: "text", text: `message ${seq}` }],
    seq,
    createdAt: new Date(),
  };
}

describe("listMessages", () => {
  beforeEach(() => {
    mockFindMany.mockReset();
  });

  it("should order by seq descending at the query level", async () => {
    mockFindMany.mockResolvedValue([]);

    await listMessages(ORG_ID, CONVERSATION_ID);

    const call = mockFindMany.mock.calls[0]?.[0] as {
      orderBy: (table: typeof chatMessages) => SQL<unknown>[];
    };
    const orderQuery = dialect.sqlToQuery(call.orderBy(chatMessages)[0] as SQL<unknown>);

    expect(orderQuery.sql).toContain("desc");
  });

  it("should not pass a limit to the query when none is given", async () => {
    mockFindMany.mockResolvedValue([]);

    await listMessages(ORG_ID, CONVERSATION_ID);

    const call = mockFindMany.mock.calls[0]?.[0];
    expect(call.limit).toBeUndefined();
  });

  it("should pass the limit through to the query", async () => {
    mockFindMany.mockResolvedValue([]);

    await listMessages(ORG_ID, CONVERSATION_ID, 40);

    const call = mockFindMany.mock.calls[0]?.[0];
    expect(call.limit).toBe(40);
  });

  it("should return rows re-ordered ascending by seq regardless of the limit", async () => {
    mockFindMany.mockResolvedValue([row(3), row(2), row(1)]);

    const result = await listMessages(ORG_ID, CONVERSATION_ID, 3);

    expect(result.map((r) => r.seq)).toEqual([1, 2, 3]);
  });
});
