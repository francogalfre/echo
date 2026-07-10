import { Separator } from "@echo/ui/components/separator";

import { createMetadata } from "@/lib/metadata";

import { LegalNotice } from "../components/legal-notice";

export const metadata = createMetadata({
  title: "Privacy Policy",
  description: "How Echo collects, uses, and protects your data.",
  path: "/legal/privacy",
});

const PrivacyPolicyPage = () => {
  return (
    <div>
      <LegalNotice />

      <h1 className="text-3xl font-semibold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Effective date: [date]</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-base font-semibold text-foreground">
            1. Information we collect
          </h2>
          <p className="mt-2">
            [Company Name] collects account information you provide directly (name, email,
            organization details), content you submit through the service (feedback entries,
            project configuration), and technical data collected automatically (IP address,
            browser type, usage logs).
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-foreground">2. How we use it</h2>
          <p className="mt-2">
            We use collected information to operate and improve the service, provide
            customer support, process payments, send administrative communications, and
            detect abuse or security incidents.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-foreground">
            3. Data sharing and subprocessors
          </h2>
          <p className="mt-2">
            We do not sell personal information. We share data with subprocessors who help
            us run the service — for example hosting providers, database providers, and
            payment processors — under confidentiality obligations, and only to the extent
            necessary to provide the service.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-foreground">4. Cookies</h2>
          <p className="mt-2">
            We use cookies and similar technologies for authentication, session management,
            and understanding how the service is used. You can control cookies through your
            browser settings.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-foreground">5. Data retention</h2>
          <p className="mt-2">
            We retain personal information for as long as your account is active or as
            needed to provide the service, comply with legal obligations, resolve disputes,
            and enforce our agreements.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-foreground">6. Security</h2>
          <p className="mt-2">
            We use administrative, technical, and physical safeguards designed to protect
            personal information, including encryption in transit and hashing of sensitive
            credentials. No method of transmission or storage is completely secure.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-foreground">7. Your rights</h2>
          <p className="mt-2">
            Depending on your location, you may have rights under laws such as the GDPR or
            CCPA to access, correct, delete, or export your personal information, or to
            object to certain processing. Contact us to exercise these rights.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-foreground">
            8. Children&apos;s privacy
          </h2>
          <p className="mt-2">
            The service is not directed to children under 16, and we do not knowingly
            collect personal information from children.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-foreground">
            9. International transfers
          </h2>
          <p className="mt-2">
            Your information may be processed in countries other than your own. Where
            required, we rely on appropriate safeguards for such transfers.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-foreground">
            10. Changes to this policy
          </h2>
          <p className="mt-2">
            We may update this policy from time to time. Material changes will be
            communicated through the service or by email.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-foreground">11. Contact</h2>
          <p className="mt-2">
            Questions about this policy can be sent to [contact email].
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
