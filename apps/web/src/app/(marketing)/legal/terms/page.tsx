import { Separator } from "@echo/ui/components/separator";

import { createMetadata } from "@/lib/metadata";

import { LegalNotice } from "../components/legal-notice";

export const metadata = createMetadata({
  title: "Terms of Service",
  description: "The terms governing your use of Echo.",
  path: "/legal/terms",
});

const TermsOfServicePage = () => {
  return (
    <div>
      <LegalNotice />

      <h1 className="text-3xl font-semibold tracking-tight">Terms of Service</h1>
      <p className="mt-2 text-sm text-muted-foreground">Effective date: [date]</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-base font-semibold text-foreground">1. Acceptance</h2>
          <p className="mt-2">
            By creating an account or using [Company Name]&apos;s service
            (&quot;Echo&quot;), you agree to these Terms of Service. If you do not agree, do
            not use the service.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-foreground">
            2. Description of service
          </h2>
          <p className="mt-2">
            Echo is a feedback infrastructure platform that lets organizations collect,
            store, and analyze feedback from their own users through an API, a hosted
            feedback page, and an embeddable widget.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-foreground">
            3. Accounts and responsibilities
          </h2>
          <p className="mt-2">
            You are responsible for maintaining the confidentiality of your account
            credentials and API keys, and for all activity that occurs under your account.
            Notify us promptly of any unauthorized use.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-foreground">4. Acceptable use</h2>
          <p className="mt-2">
            You may not use the service to collect unlawful content, violate the rights of
            others, distribute malware, or attempt to circumvent rate limits, plan limits,
            or security controls.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-foreground">
            5. Subscriptions and billing
          </h2>
          <p className="mt-2">
            Echo offers a Free plan and a Pro plan. Paid subscriptions are billed through
            our payment processor, Polar. Fees are non-refundable except where required by
            law. We may change pricing with reasonable notice.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-foreground">
            6. Intellectual property
          </h2>
          <p className="mt-2">
            [Company Name] retains all rights to the service. You retain ownership of the
            feedback content submitted through your projects, and grant us a license to
            process it solely to provide the service.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-foreground">7. Termination</h2>
          <p className="mt-2">
            You may stop using the service and delete your account at any time. We may
            suspend or terminate accounts that violate these terms or applicable law.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-foreground">
            8. Disclaimers and warranties
          </h2>
          <p className="mt-2">
            The service is provided &quot;as is&quot; without warranties of any kind,
            express or implied, including merchantability, fitness for a particular purpose,
            and non-infringement.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-foreground">
            9. Limitation of liability
          </h2>
          <p className="mt-2">
            To the maximum extent permitted by law, [Company Name] will not be liable for
            indirect, incidental, special, or consequential damages arising from your use of
            the service.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-foreground">10. Governing law</h2>
          <p className="mt-2">
            These terms are governed by the laws of [jurisdiction], without regard to its
            conflict of law principles.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-foreground">11. Changes</h2>
          <p className="mt-2">
            We may update these terms from time to time. Continued use of the service after
            changes take effect constitutes acceptance of the revised terms.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-foreground">12. Contact</h2>
          <p className="mt-2">
            Questions about these terms can be sent to [contact email].
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
