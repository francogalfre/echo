import { Separator } from "@echo/ui/components/separator";

import { createMetadata } from "@/utils/metadata";

export const metadata = createMetadata({
  title: "Terms of Service",
  description: "The terms governing your use of Echo.",
  path: "/legal/terms",
});

const TermsOfServicePage = () => {
  return (
    <div>
      <h1 className="text-4xl font-medium tracking-tight">Terms of Service</h1>
      <p className="mt-4 text-muted-foreground">
        By using Echo, you agree to these terms. We&apos;ve kept them short and in plain
        language.
      </p>

      <div className="mt-12 space-y-10 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-base font-medium text-foreground">What Echo is</h2>
          <p className="mt-3">
            Echo is feedback infrastructure for developers: an API, a hosted feedback page,
            and a widget for collecting and managing feedback from your users.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-medium text-foreground">Your account</h2>
          <p className="mt-3">
            You&apos;re responsible for your account, your API keys, and any activity that
            happens under them. Keep your credentials secure and let us know if you think
            they&apos;ve been compromised.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-medium text-foreground">Acceptable use</h2>
          <p className="mt-3">
            Don&apos;t use Echo to collect unlawful content, abuse the service, or try to
            bypass rate limits or plan limits.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-medium text-foreground">Plans and billing</h2>
          <p className="mt-3">
            Echo offers a Free plan and a Pro plan. Paid plans are billed on a recurring
            basis through our payment processor, Polar. You can cancel anytime from your
            dashboard; cancellation takes effect at the end of the current billing period.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-medium text-foreground">Your content</h2>
          <p className="mt-3">
            You own the feedback data you collect through Echo. We only use it to provide
            the service to you.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-medium text-foreground">Termination</h2>
          <p className="mt-3">
            You can stop using Echo and delete your account at any time. We may suspend or
            terminate accounts that violate these terms.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-medium text-foreground">Disclaimer</h2>
          <p className="mt-3">
            Echo is provided &quot;as is,&quot; without warranties of any kind. We work hard
            to keep it reliable, but we can&apos;t guarantee it will always be error-free or
            uninterrupted.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-medium text-foreground">Changes</h2>
          <p className="mt-3">
            We may update these terms from time to time. Continued use of Echo after changes
            take effect means you accept the updated terms.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-medium text-foreground">Contact</h2>
          <p className="mt-3">
            Questions? Email us at{" "}
            <a
              href="mailto:francogalfre.code@gmail.com"
              className="font-medium text-foreground underline"
            >
              francogalfre.code@gmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
