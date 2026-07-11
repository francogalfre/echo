import { Separator } from "@echo/ui/components/separator";

import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Privacy Policy",
  description: "How Echo collects, uses, and protects your data.",
  path: "/legal/privacy",
});

const PrivacyPolicyPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Privacy Policy</h1>
      <p className="mt-3 text-muted-foreground">
        Echo is feedback infrastructure for developers. This page explains what we collect
        and how we use it, in plain language.
      </p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-base font-semibold text-foreground">What we collect</h2>
          <ul className="mt-2 space-y-1.5">
            <li>Account information — your name and email address when you sign up.</li>
            <li>
              Feedback content — the feedback your users submit through your projects, via
              the API, widget, or hosted feedback page.
            </li>
            <li>
              Basic usage data — things like IP address and browser type, used to keep the
              service secure and reliable.
            </li>
          </ul>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-foreground">How we use it</h2>
          <p className="mt-2">
            We use this information to run Echo: authenticate you, store and display
            feedback for your projects, and keep the service secure. We don&apos;t use your
            data for anything beyond that.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-foreground">Sharing</h2>
          <p className="mt-2">
            We do not sell your data. We share it only with the infrastructure providers
            that run Echo — hosting, database, and email — and only as needed to provide the
            service.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-foreground">Data retention</h2>
          <p className="mt-2">
            We keep your data for as long as your account is active. If you delete your
            account, we delete your data with it, except where we&apos;re required to keep
            it for legal reasons.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-foreground">Security</h2>
          <p className="mt-2">
            We use industry-standard measures to protect your data, including encryption in
            transit and hashing of API keys and passwords. No system is perfectly secure,
            but we take this seriously.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-foreground">Your rights</h2>
          <p className="mt-2">
            You can access, update, or delete your account data at any time from your
            dashboard settings. If you need help, contact us.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-foreground">Changes</h2>
          <p className="mt-2">
            If we make material changes to this policy, we&apos;ll let you know through the
            product or by email.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-foreground">Contact</h2>
          <p className="mt-2">
            Questions? Email us at{" "}
            <a
              href="mailto:support@echo.dev"
              className="font-medium text-foreground underline"
            >
              support@echo.dev
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
