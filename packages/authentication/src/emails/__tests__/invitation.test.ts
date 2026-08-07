import { describe, expect, it } from "vitest";

import { buildInvitationEmail } from "../invitation";

describe("buildInvitationEmail", () => {
  it("should include the inviter and organization name in the subject", () => {
    const email = buildInvitationEmail({
      inviterName: "Ada",
      organizationName: "Acme",
      acceptLink: "https://echo.builders/accept-invitation/inv_1",
    });

    expect(email.subject).toBe("Ada invited you to join Acme on Echo");
    expect(email.html).toContain("https://echo.builders/accept-invitation/inv_1");
  });

  it("should escape HTML in user-controlled fields", () => {
    const email = buildInvitationEmail({
      inviterName: "<img src=x onerror=alert(1)>",
      organizationName: "Acme & Co",
      acceptLink: "https://echo.builders/accept-invitation/inv_1",
    });

    expect(email.html).not.toContain("<img src=x onerror=alert(1)>");
    expect(email.html).toContain("&lt;img src=x onerror=alert(1)&gt;");
    expect(email.html).toContain("Acme &amp; Co");
  });
});
