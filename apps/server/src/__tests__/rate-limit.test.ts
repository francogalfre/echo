import { Hono } from "hono";
import { beforeEach, describe, expect, it, vi } from "vitest";

const limitMock = vi.fn();

vi.mock("@echo/api/lib/redis", () => ({
  hasRedis: true,
  redis: {},
}));

vi.mock("@upstash/ratelimit", () => {
  class Ratelimit {
    static slidingWindow = vi.fn(() => "window");
    limit = limitMock;
  }
  return { Ratelimit };
});

const { guardWidgetRead, widgetReadRateLimit } = await import("../middleware/rate-limit");

describe("guardWidgetRead", () => {
  beforeEach(() => {
    limitMock.mockReset();
  });

  it("should allow the request and key by ip and org slug when under the limit", async () => {
    limitMock.mockResolvedValue({ success: true });

    await expect(guardWidgetRead("1.2.3.4", "acme")).resolves.toBe(true);
    expect(limitMock).toHaveBeenCalledWith("1.2.3.4:acme");
  });

  it("should block the request once the limit is exceeded", async () => {
    limitMock.mockResolvedValue({ success: false });

    await expect(guardWidgetRead("1.2.3.4", "acme")).resolves.toBe(false);
  });

  it("should fail open when the redis client throws", async () => {
    limitMock.mockRejectedValue(new Error("upstash unreachable"));

    await expect(guardWidgetRead("1.2.3.4", "acme")).resolves.toBe(true);
  });
});

describe("widgetReadRateLimit", () => {
  beforeEach(() => {
    limitMock.mockReset();
  });

  it("should call next() when the request is under the limit", async () => {
    limitMock.mockResolvedValue({ success: true });
    const app = new Hono();
    app.get("/:orgSlug/thing", widgetReadRateLimit, (c) => c.json({ ok: true }));

    const res = await app.request("/acme/thing", {
      headers: { "x-forwarded-for": "1.2.3.4" },
    });

    expect(res.status).toBe(200);
  });

  it("should return 429 when the request exceeds the limit", async () => {
    limitMock.mockResolvedValue({ success: false });
    const app = new Hono();
    app.get("/:orgSlug/thing", widgetReadRateLimit, (c) => c.json({ ok: true }));

    const res = await app.request("/acme/thing", {
      headers: { "x-forwarded-for": "1.2.3.4" },
    });

    expect(res.status).toBe(429);
  });
});
