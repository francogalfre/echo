import { describe, expect, it, vi } from "vitest";

vi.mock("@echo/api/lib/redis", () => ({
  hasRedis: false,
  redis: null,
}));

const { guardWidgetRead } = await import("../middleware/rate-limit");

describe("guardWidgetRead when redis is not configured", () => {
  it("should fail open and allow the request", async () => {
    await expect(guardWidgetRead("1.2.3.4", "acme")).resolves.toBe(true);
  });
});
