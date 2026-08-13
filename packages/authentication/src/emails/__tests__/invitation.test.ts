import { describe, expect, it } from "vitest";

import { buildInvitationEmail } from "../invitation";

describe("buildInvitationEmail", () => {
  it("should include the inviter and organization name in the subject", () => {
    const email = buildInvitationEmail({
      inviterName: "Ada",
      organizationName: "Acme",
      acceptLink: "https://echo.builders/accept-invitation/inv_1",
      logoUrl: "https://echo.builders/logo-email.png",
    });

    expect(email.subject).toBe("Ada invited you to join Acme on Echo");
    expect(email.html).toContain("https://echo.builders/accept-invitation/inv_1");
  });

  it("should escape HTML in user-controlled fields", () => {
    const email = buildInvitationEmail({
      inviterName: "<img src=x onerror=alert(1)>",
      organizationName: "Acme & Co",
      acceptLink: "https://echo.builders/accept-invitation/inv_1",
      logoUrl: "https://echo.builders/logo-email.png",
    });

    expect(email.html).not.toContain("<img src=x onerror=alert(1)>");
    expect(email.html).toContain("&lt;img src=x onerror=alert(1)&gt;");
    expect(email.html).toContain("Acme &amp; Co");
  });

  it("should reference the logo by absolute HTTPS URL instead of a data URI", () => {
    const email = buildInvitationEmail({
      inviterName: "Ada",
      organizationName: "Acme",
      acceptLink: "https://echo.builders/accept-invitation/inv_1",
      logoUrl: "https://echo.builders/logo-email.png",
    });

    expect(email.html).toContain('src="https://echo.builders/logo-email.png"');
    expect(email.html).not.toContain("data:image");
  });

  it("should include a plain-text alternative", () => {
    const email = buildInvitationEmail({
      inviterName: "Ada",
      organizationName: "Acme",
      acceptLink: "https://echo.builders/accept-invitation/inv_1",
      logoUrl: "https://echo.builders/logo-email.png",
    });

    expect(email.text).toContain("Ada invited you to join Acme on Echo");
    expect(email.text).toContain("https://echo.builders/accept-invitation/inv_1");
  });
});
