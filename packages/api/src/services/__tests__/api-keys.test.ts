import { apiKeys } from "@echo/db/schema/feedback";
import type { SQL } from "drizzle-orm";
import { PgDialect } from "drizzle-orm/pg-core";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockInsertReturning = vi.fn();
const mockInsertValues = vi.fn((_values: unknown) => ({ returning: mockInsertReturning }));
const mockInsert = vi.fn(() => ({ values: mockInsertValues }));

const mockUpdateReturning = vi.fn();
const mockUpdateWhere = vi.fn((_condition: SQL<unknown>) => ({
  returning: mockUpdateReturning,
}));
const mockUpdateSet = vi.fn((_values: unknown) => ({ where: mockUpdateWhere }));
const mockUpdate = vi.fn(() => ({ set: mockUpdateSet }));

const mockFindMany = vi.fn();

vi.mock("@echo/db", () => ({
  db: {
    insert: mockInsert,
    update: mockUpdate,
    query: { apiKeys: { findMany: mockFindMany } },
  },
}));

const { insertApiKey, revokeApiKey, findKeysByOrganization, touchLastUsed } =
  await import("../api-keys");

const dialect = new PgDialect();
const ORG_ID = "org_1";

describe("insertApiKey", () => {
  beforeEach(() => {
    mockInsert.mockClear();
    mockInsertValues.mockClear();
    mockInsertReturning.mockReset();
  });

  it("should insert a row with the provided fields and default scopes copied as a plain array", async () => {
    mockInsertReturning.mockResolvedValue([{ id: "key_1" }]);

    await insertApiKey({
      organizationId: ORG_ID,
      name: "Default",
      publicKey: "echo_pk_abc",
      publicKeyHash: "hash_pk",
      secretKeyHash: "hash_sk",
      secretKeyPrefix: "hash_sk_pre",
      scopes: ["feedback:write"],
      createdBy: "user_1",
    });

    const values = mockInsertValues.mock.calls[0]?.[0] as Record<string, unknown>;

    expect(values.organizationId).toBe(ORG_ID);
    expect(values.name).toBe("Default");
    expect(values.publicKey).toBe("echo_pk_abc");
    expect(values.publicKeyHash).toBe("hash_pk");
    expect(values.secretKeyHash).toBe("hash_sk");
    expect(values.secretKeyPrefix).toBe("hash_sk_pre");
    expect(values.scopes).toEqual(["feedback:write"]);
    expect(values.createdBy).toBe("user_1");
    expect(typeof values.id).toBe("string");
  });

  it("should return the inserted row", async () => {
    const row = { id: "key_1", organizationId: ORG_ID };
    mockInsertReturning.mockResolvedValue([row]);

    const result = await insertApiKey({
      organizationId: ORG_ID,
      name: "Default",
      publicKey: "echo_pk_abc",
      publicKeyHash: "hash_pk",
      secretKeyHash: "hash_sk",
      secretKeyPrefix: "hash_sk_pre",
      scopes: ["feedback:write"],
      createdBy: "user_1",
    });

    expect(result).toBe(row);
  });

  it("should throw when the insert returns no row", async () => {
    mockInsertReturning.mockResolvedValue([]);

    await expect(
      insertApiKey({
        organizationId: ORG_ID,
        name: "Default",
        publicKey: "echo_pk_abc",
        publicKeyHash: "hash_pk",
        secretKeyHash: "hash_sk",
        secretKeyPrefix: "hash_sk_pre",
        scopes: ["feedback:write"],
        createdBy: "user_1",
      }),
    ).rejects.toThrow();
  });
});

describe("revokeApiKey", () => {
  beforeEach(() => {
    mockUpdate.mockClear();
    mockUpdateSet.mockClear();
    mockUpdateWhere.mockClear();
    mockUpdateReturning.mockReset();
  });

  it("should scope the update to id and organization", async () => {
    mockUpdateReturning.mockResolvedValue([{ id: "key_1" }]);
    const revokedAt = new Date("2026-07-30T00:00:00Z");

    await revokeApiKey("key_1", ORG_ID, revokedAt);

    expect(mockUpdateSet).toHaveBeenCalledWith({ revokedAt });

    const call = mockUpdateWhere.mock.calls[0]?.[0];
    const query = dialect.sqlToQuery(call as SQL<unknown>);

    expect(query.sql).toContain('"api_keys"."id" = $1');
    expect(query.sql).toContain('"api_keys"."organization_id" = $2');
    expect(query.params).toEqual(["key_1", ORG_ID]);
  });

  it("should return true when a row was revoked", async () => {
    mockUpdateReturning.mockResolvedValue([{ id: "key_1" }]);

    const result = await revokeApiKey("key_1", ORG_ID, new Date());

    expect(result).toBe(true);
  });

  it("should return false when no row matches the id and organization", async () => {
    mockUpdateReturning.mockResolvedValue([]);

    const result = await revokeApiKey("key_1", "other_org", new Date());

    expect(result).toBe(false);
  });
});

describe("findKeysByOrganization", () => {
  beforeEach(() => {
    mockFindMany.mockClear();
    mockFindMany.mockResolvedValue([]);
  });

  it("should filter by organization and order by createdAt descending", async () => {
    await findKeysByOrganization(ORG_ID);

    const call = mockFindMany.mock.calls[0]?.[0] as {
      where: (table: typeof apiKeys) => SQL<unknown>;
      orderBy: (table: typeof apiKeys) => SQL<unknown>;
    };

    const whereQuery = dialect.sqlToQuery(call.where(apiKeys));
    expect(whereQuery.sql).toBe('"api_keys"."organization_id" = $1');
    expect(whereQuery.params).toEqual([ORG_ID]);

    const orderByQuery = dialect.sqlToQuery(call.orderBy(apiKeys));
    expect(orderByQuery.sql).toContain('"api_keys"."created_at"');
    expect(orderByQuery.sql).toContain("desc");
  });
});

describe("touchLastUsed", () => {
  beforeEach(() => {
    mockUpdate.mockClear();
    mockUpdateSet.mockClear();
    mockUpdateWhere.mockClear();
  });

  it("should scope the throttled update to the key id and a stale lastUsedAt window", async () => {
    await touchLastUsed("key_1");

    const call = mockUpdateWhere.mock.calls[0]?.[0];
    const query = dialect.sqlToQuery(call as SQL<unknown>);

    expect(query.sql).toContain('"api_keys"."id" = $1');
    expect(query.sql).toContain('"api_keys"."last_used_at" is null');
    expect(query.sql).toContain('"api_keys"."last_used_at" < $2');
    expect(query.params[0]).toBe("key_1");
    expect(typeof query.params[1]).toBe("string");
  });

  it("should set lastUsedAt to the current time", async () => {
    const before = Date.now();
    await touchLastUsed("key_1");
    const after = Date.now();

    const setArg = mockUpdateSet.mock.calls[0]?.[0] as { lastUsedAt: Date };
    expect(setArg.lastUsedAt.getTime()).toBeGreaterThanOrEqual(before);
    expect(setArg.lastUsedAt.getTime()).toBeLessThanOrEqual(after);
  });
});
