import type { SQL } from "drizzle-orm";
import { PgDialect } from "drizzle-orm/pg-core";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockReturning = vi.fn();
const mockWhere = vi.fn((_condition: SQL<unknown>) => ({ returning: mockReturning }));
const mockSet = vi.fn((_values: unknown) => ({ where: mockWhere }));
const mockUpdate = vi.fn(() => ({ set: mockSet }));

const mockTxWhere = vi.fn();
const mockTxSet = vi.fn((_values: unknown) => ({ where: mockTxWhere }));
const mockTxUpdate = vi.fn(() => ({ set: mockTxSet }));
const mockTx = { update: mockTxUpdate };
const mockTransaction = vi.fn(async (callback: (tx: typeof mockTx) => Promise<unknown>) =>
  callback(mockTx),
);

const mockDeleteReturning = vi.fn();
const mockDeleteWhere = vi.fn((_condition: SQL<unknown>) => ({
  returning: mockDeleteReturning,
}));
const mockDelete = vi.fn(() => ({ where: mockDeleteWhere }));

vi.mock("@echo/db", () => ({
  db: {
    update: mockUpdate,
    transaction: mockTransaction,
    delete: mockDelete,
  },
}));

const { moveBoardItem, reindexColumn, removeBoardItemByFeedbackId } =
  await import("../board");

const dialect = new PgDialect();
const ORG_ID = "org_1";

describe("moveBoardItem", () => {
  beforeEach(() => {
    mockUpdate.mockClear();
    mockSet.mockClear();
    mockWhere.mockClear();
    mockReturning.mockReset();
  });

  it("should write both column and position, scoped to id and organization", async () => {
    mockReturning.mockResolvedValue([{ id: "item_1" }]);

    await moveBoardItem("item_1", ORG_ID, "in_progress", 2);

    expect(mockSet).toHaveBeenCalledWith({ column: "in_progress", position: 2 });

    const call = mockWhere.mock.calls[0]?.[0];
    const query = dialect.sqlToQuery(call as SQL<unknown>);

    expect(query.sql).toContain('"board_items"."id" = $1');
    expect(query.sql).toContain('"board_items"."organization_id" = $2');
    expect(query.params).toEqual(["item_1", ORG_ID]);
  });

  it("should return true when the item was updated", async () => {
    mockReturning.mockResolvedValue([{ id: "item_1" }]);

    const result = await moveBoardItem("item_1", ORG_ID, "done", 0);

    expect(result).toBe(true);
  });

  it("should return false when no row matches the id and organization", async () => {
    mockReturning.mockResolvedValue([]);

    const result = await moveBoardItem("item_1", "other_org", "done", 0);

    expect(result).toBe(false);
  });
});

describe("removeBoardItemByFeedbackId", () => {
  beforeEach(() => {
    mockDelete.mockClear();
    mockDeleteWhere.mockClear();
    mockDeleteReturning.mockReset();
  });

  it("should scope the delete to feedback id and organization", async () => {
    mockDeleteReturning.mockResolvedValue([{ id: "item_1" }]);

    await removeBoardItemByFeedbackId("fb_1", ORG_ID);

    const call = mockDeleteWhere.mock.calls[0]?.[0];
    const query = dialect.sqlToQuery(call as SQL<unknown>);

    expect(query.sql).toContain('"board_items"."feedback_id" = $1');
    expect(query.sql).toContain('"board_items"."organization_id" = $2');
    expect(query.params).toEqual(["fb_1", ORG_ID]);
  });

  it("should return false when no row matches", async () => {
    mockDeleteReturning.mockResolvedValue([]);

    const result = await removeBoardItemByFeedbackId("fb_1", ORG_ID);

    expect(result).toBe(false);
  });
});

describe("reindexColumn", () => {
  beforeEach(() => {
    mockTransaction.mockClear();
    mockTxUpdate.mockClear();
    mockTxSet.mockClear();
    mockTxWhere.mockClear();
    mockTxWhere.mockResolvedValue(undefined);
  });

  it("should renumber every id in order starting at zero", async () => {
    await reindexColumn(ORG_ID, "backlog", ["item_a", "item_b", "item_c"]);

    expect(mockTxSet).toHaveBeenNthCalledWith(1, { position: 0 });
    expect(mockTxSet).toHaveBeenNthCalledWith(2, { position: 1 });
    expect(mockTxSet).toHaveBeenNthCalledWith(3, { position: 2 });
  });

  it("should scope each update to id, organization and column", async () => {
    await reindexColumn(ORG_ID, "backlog", ["item_a"]);

    const call = mockTxWhere.mock.calls[0]?.[0];
    const query = dialect.sqlToQuery(call);

    expect(query.sql).toContain('"board_items"."id" = $1');
    expect(query.sql).toContain('"board_items"."organization_id" = $2');
    expect(query.sql).toContain('"board_items"."column" = $3');
    expect(query.params).toEqual(["item_a", ORG_ID, "backlog"]);
  });

  it("should run all updates inside a single transaction", async () => {
    await reindexColumn(ORG_ID, "done", ["item_a", "item_b"]);

    expect(mockTransaction).toHaveBeenCalledTimes(1);
    expect(mockTxUpdate).toHaveBeenCalledTimes(2);
  });
});
