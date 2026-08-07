import { db } from "@echo/db";
import { notifications } from "@echo/db/schema/notifications";

export async function notifyOrganizationCreated(data: {
  organization: { id: string; name: string };
}): Promise<void> {
  await db.insert(notifications).values({
    id: crypto.randomUUID(),
    organizationId: data.organization.id,
    type: "organization.created",
    title: "Welcome to Echo",
    body: `${data.organization.name} is ready — generate an API key or install the widget to start collecting feedback.`,
    link: "/dashboard/collect",
  });
}

export async function notifyMemberJoined(data: {
  member: { organizationId: string; role: string };
  user: { name: string };
  organization: { name: string };
}): Promise<void> {
  if (data.member.role === "owner") return;

  await db.insert(notifications).values({
    id: crypto.randomUUID(),
    organizationId: data.member.organizationId,
    type: "member.joined",
    title: `${data.user.name} joined ${data.organization.name}`,
    link: "/dashboard/settings/team",
  });
}
