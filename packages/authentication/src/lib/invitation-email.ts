import { env } from "@echo/env/server";
import { Resend } from "resend";
import type { OrganizationOptions } from "better-auth/plugins";

type SendInvitationEmail = NonNullable<OrganizationOptions["sendInvitationEmail"]>;

function buildInvitationEmailHtml(input: {
  inviterName: string;
  organizationName: string;
  acceptLink: string;
}): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
      <p style="font-size: 14px; color: #18181b; line-height: 1.6;">
        <strong>${input.inviterName}</strong> invited you to join
        <strong>${input.organizationName}</strong> on Echo.
      </p>
      <a
        href="${input.acceptLink}"
        style="display: inline-block; margin-top: 16px; padding: 10px 20px; background: #18181b;
          color: #ffffff; font-size: 14px; font-weight: 500; text-decoration: none; border-radius: 8px;"
      >
        Accept invitation
      </a>
      <p style="margin-top: 24px; font-size: 12px; color: #71717a; line-height: 1.6;">
        If you weren't expecting this invitation, you can ignore this email.
      </p>
    </div>
  `;
}

export const sendInvitationEmail: SendInvitationEmail = async (data) => {
  if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL) {
    console.warn(
      "RESEND_API_KEY or RESEND_FROM_EMAIL is not set — skipping invitation email",
    );
    return;
  }

  const resend = new Resend(env.RESEND_API_KEY);
  const acceptLink = `${env.CORS_ORIGIN}/accept-invitation/${data.id}`;

  const { error } = await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: data.email,
    subject: `${data.inviter.user.name} invited you to join ${data.organization.name} on Echo`,
    html: buildInvitationEmailHtml({
      inviterName: data.inviter.user.name,
      organizationName: data.organization.name,
      acceptLink,
    }),
  });

  if (error) {
    console.error("Failed to send invitation email", error);
  }
};
