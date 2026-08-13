import { env } from "@echo/env/server";
import { Resend } from "resend";
import type { OrganizationOptions } from "better-auth/plugins";

import { buildInvitationEmail } from "../emails/invitation";

type SendInvitationEmail = NonNullable<OrganizationOptions["sendInvitationEmail"]>;

export const sendInvitationEmail: SendInvitationEmail = async (data) => {
  if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL) {
    console.warn(
      "RESEND_API_KEY or RESEND_FROM_EMAIL is not set — skipping invitation email",
    );
    return;
  }

  const resend = new Resend(env.RESEND_API_KEY);
  const acceptLink = `${env.CORS_ORIGIN}/accept-invitation/${data.id}`;
  const logoUrl = `${env.CORS_ORIGIN}/logo-email.png`;

  const email = buildInvitationEmail({
    inviterName: data.inviter.user.name,
    organizationName: data.organization.name,
    acceptLink,
    logoUrl,
  });

  const { error } = await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: data.email,
    replyTo: env.RESEND_FROM_EMAIL,
    subject: email.subject,
    html: email.html,
    text: email.text,
  });

  if (error) {
    console.error("Failed to send invitation email", error);
  }
};
