import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../redis", () => ({
  redis: { set: vi.fn() },
}));

vi.mock("@upstash/ratelimit", () => {
  class Ratelimit {
    static slidingWindow = vi.fn(() => ({}));
    limit = vi.fn(async () => ({ success: true }));
  }
  return { Ratelimit };
});

const { redis } = await import("../redis");
const { guardSubmission } = await import("../rate-limit");

describe("guardSubmission", () => {
  beforeEach(() => {
    vi.mocked(redis!.set).mockReset();
  });

  it("should allow a first-time submission and write the dedup key", async () => {
    vi.mocked(redis!.set).mockResolvedValue("OK");

    const result = await guardSubmission("1.2.3.4", "lens", "Great product");

    expect(result).toEqual({ allowed: true });
    expect(redis!.set).toHaveBeenCalledWith(
      expect.stringContaining("echo:dedup:"),
      "1",
      expect.objectContaining({ nx: true }),
    );
  });

  it("should block a duplicate submission with a visible error, not a silent success", async () => {
    vi.mocked(redis!.set).mockResolvedValue(null);

    const result = await guardSubmission("1.2.3.4", "lens", "Great product");

    expect(result.allowed).toBe(false);
    if (result.allowed) throw new Error("unreachable");
    expect(result.status).toBe(409);
    expect(result.message.length).toBeGreaterThan(0);
  });

  it("should not key the dedup cache by ip when ip is unknown", async () => {
    const result = await guardSubmission("unknown", "lens", "Great product");

    expect(result).toEqual({ allowed: true });
    expect(redis!.set).not.toHaveBeenCalled();
  });
});
