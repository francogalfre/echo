import { beforeEach, describe, expect, it, vi } from "vitest";

const mockInsertValues = vi.fn((_values: unknown) => Promise.resolve(undefined));
const mockInsert = vi.fn(() => ({ values: mockInsertValues }));

vi.mock("@echo/db", () => ({
  db: { insert: mockInsert },
}));

const { notifyMemberJoined, notifyOrganizationCreated } =
  await import("../organization-notifications");

describe("notifyOrganizationCreated", () => {
  beforeEach(() => {
    mockInsert.mockClear();
    mockInsertValues.mockClear();
  });

  it("should insert an organization.created notification linking to collect", async () => {
    await notifyOrganizationCreated({ organization: { id: "org_1", name: "Acme" } });

    const values = mockInsertValues.mock.calls[0]?.[0] as Record<string, unknown>;

    expect(values.organizationId).toBe("org_1");
    expect(values.type).toBe("organization.created");
    expect(values.title).toBe("Welcome to Echo");
    expect(values.link).toBe("/dashboard/collect");
  });
});

describe("notifyMemberJoined", () => {
  beforeEach(() => {
    mockInsert.mockClear();
    mockInsertValues.mockClear();
  });

  it("should insert a member.joined notification linking to the team settings page", async () => {
    await notifyMemberJoined({
      member: { organizationId: "org_1", role: "member" },
      user: { name: "Ada" },
      organization: { name: "Acme" },
    });

    const values = mockInsertValues.mock.calls[0]?.[0] as Record<string, unknown>;

    expect(values.organizationId).toBe("org_1");
    expect(values.type).toBe("member.joined");
    expect(values.title).toBe("Ada joined Acme");
    expect(values.link).toBe("/dashboard/settings/team");
  });

  it("should skip the notification for the organization creator", async () => {
    await notifyMemberJoined({
      member: { organizationId: "org_1", role: "owner" },
      user: { name: "Ada" },
      organization: { name: "Acme" },
    });

    expect(mockInsert).not.toHaveBeenCalled();
  });
});
