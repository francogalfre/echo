import { Hono } from "hono";
import { describe, expect, it, vi } from "vitest";

import { createSubmitHandler } from "../lib/submit";

function buildApp(submit: Parameters<typeof createSubmitHandler>[0]): Hono {
  const app = new Hono();
  app.post("/", createSubmitHandler(submit));
  return app;
}

describe("createSubmitHandler", () => {
  it("should return 400 for an invalid JSON body", async () => {
    const submit = vi.fn();
    const app = buildApp(submit);

    const res = await app.request("/", { method: "POST", body: "not json" });

    expect(res.status).toBe(400);
    expect(submit).not.toHaveBeenCalled();
  });

  it("should return 400 when required fields fail schema validation", async () => {
    const submit = vi.fn();
    const app = buildApp(submit);

    const res = await app.request("/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Ana" }),
    });

    expect(res.status).toBe(400);
    expect(submit).not.toHaveBeenCalled();
  });

  it("should call submit with the parsed body and authorization header, returning 201 on success", async () => {
    const submit = vi.fn().mockResolvedValue({ success: true });
    const app = buildApp(submit);

    const res = await app.request("/", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer echo_abc" },
      body: JSON.stringify({ name: "Ana", feedback: "Great product" }),
    });

    expect(res.status).toBe(201);
    expect(submit).toHaveBeenCalledWith({
      authorization: "Bearer echo_abc",
      name: "Ana",
      feedback: "Great product",
    });
  });

  it("should map a failed SubmitResult to its status code and error body", async () => {
    const submit = vi
      .fn()
      .mockResolvedValue({ success: false, status: 429, error: "Too many requests" });
    const app = buildApp(submit);

    const res = await app.request("/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Ana", feedback: "Great product" }),
    });

    expect(res.status).toBe(429);
    await expect(res.json()).resolves.toEqual({ error: "Too many requests" });
  });
});
