import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../../controllers/enqueue", () => ({
  enqueue: vi.fn(),
}));

vi.mock("../../../services/organization", () => ({
  listOrganizationIdsWithFeedback: vi.fn(),
}));

const { enqueue } = await import("../../../controllers/enqueue");
const { listOrganizationIdsWithFeedback } = await import("../../../services/organization");
const { handleDigestWeeklySweep } = await import("../digest-weekly-sweep");

describe("handleDigestWeeklySweep", () => {
  beforeEach(() => {
    vi.mocked(enqueue).mockReset().mockResolvedValue({ enqueued: true });
    vi.mocked(listOrganizationIdsWithFeedback).mockReset();
  });

  it("should enqueue a digest.generate job for every organization with feedback", async () => {
    vi.mocked(listOrganizationIdsWithFeedback).mockResolvedValue(["org_1", "org_2"]);

    await handleDigestWeeklySweep();

    expect(enqueue).toHaveBeenCalledTimes(2);
    expect(enqueue).toHaveBeenCalledWith(
      "digest.generate",
      { organizationId: "org_1" },
      { organizationId: "org_1", dedupeKey: "org_1" },
    );
    expect(enqueue).toHaveBeenCalledWith(
      "digest.generate",
      { organizationId: "org_2" },
      { organizationId: "org_2", dedupeKey: "org_2" },
    );
  });

  it("should not enqueue anything when no organizations have feedback", async () => {
    vi.mocked(listOrganizationIdsWithFeedback).mockResolvedValue([]);

    await handleDigestWeeklySweep();

    expect(enqueue).not.toHaveBeenCalled();
  });
});
