const BRAND_COLOR = "#6b5ce7";

type EmailLayoutInput = {
  preheader: string;
  heading: string;
  bodyHtml: string;
  ctaLabel: string;
  ctaLink: string;
  logoUrl: string;
};

export function renderEmailLayout(input: EmailLayoutInput): string {
  return `
    <div style="display: none; max-height: 0; overflow: hidden; opacity: 0;">${input.preheader}</div>
    <div style="background: #f4f4f5; padding: 40px 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
      <div style="max-width: 480px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 28px;">
          <img
            src="${input.logoUrl}"
            alt="Echo"
            width="120"
            style="display: inline-block; height: auto; border: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 20px; font-weight: 700; color: ${BRAND_COLOR};"
          />
        </div>

        <div style="background: #ffffff; border-radius: 16px; padding: 40px 32px; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04), 0 8px 24px -4px rgba(0, 0, 0, 0.08);">
          <h1 style="margin: 0 0 14px; font-size: 18px; font-weight: 600; color: #18181b; letter-spacing: -0.01em;">
            ${input.heading}
          </h1>
          <div style="font-size: 14px; color: #52525b; line-height: 1.65;">
            ${input.bodyHtml}
          </div>

          <a
            href="${input.ctaLink}"
            style="display: inline-block; margin-top: 24px; padding: 12px 24px; background: ${BRAND_COLOR};
              color: #ffffff; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 10px;"
          >
            ${input.ctaLabel}
          </a>

          <p style="margin-top: 24px; font-size: 12px; color: #a1a1aa; line-height: 1.6; word-break: break-all;">
            Or copy this link into your browser:<br />
            <a href="${input.ctaLink}" style="color: ${BRAND_COLOR}; text-decoration: underline;">${input.ctaLink}</a>
          </p>
        </div>

        <p style="margin-top: 24px; text-align: center; font-size: 12px; color: #a1a1aa; line-height: 1.6;">
          If you weren't expecting this email, you can safely ignore it.<br />
          Sent by Echo · echo.builders
        </p>
      </div>
    </div>
  `;
}
