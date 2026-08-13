import { escapeHtml } from "./escape-html";
import { renderEmailLayout } from "./layout";

type InvitationEmailInput = {
  inviterName: string;
  organizationName: string;
  acceptLink: string;
  logoUrl: string;
};

type InvitationEmail = { subject: string; html: string; text: string };

export function buildInvitationEmail(input: InvitationEmailInput): InvitationEmail {
  const inviterName = escapeHtml(input.inviterName);
  const organizationName = escapeHtml(input.organizationName);

  return {
    subject: `${input.inviterName} invited you to join ${input.organizationName} on Echo`,
    html: renderEmailLayout({
      preheader: `${inviterName} invited you to join ${organizationName} on Echo`,
      heading: `You're invited to join ${organizationName}`,
      bodyHtml: `
        <p style="margin: 0 0 12px;">
          <strong>${inviterName}</strong> invited you to join <strong>${organizationName}</strong>
          on Echo, developer-first feedback infrastructure for collecting, understanding, and
          acting on user feedback.
        </p>
        <p style="margin: 0;">
          Accept the invitation below to get access to the team's projects, feedback, and
          dashboard.
        </p>
      `,
      ctaLabel: "Accept invitation",
      ctaLink: input.acceptLink,
      logoUrl: input.logoUrl,
    }),
    text: `${input.inviterName} invited you to join ${input.organizationName} on Echo, developer-first feedback infrastructure for collecting, understanding, and acting on user feedback.

Accept the invitation to get access to the team's projects, feedback, and dashboard:
${input.acceptLink}

If you weren't expecting this email, you can safely ignore it.`,
  };
}
