import { env } from "@echo/env/web";
import { CodeBlock } from "@echo/ui/components/code-block";
import type { DocsTocSection } from "@echo/ui/components/docs/docs-toc";
import { InlineCode } from "@echo/ui/components/docs/inline-code";
import { FadeIn } from "@echo/ui/components/fade-in";
import { Icons } from "@echo/ui/components/icons";
import Link from "next/link";

import { createMetadata } from "@/utils/metadata";

import { DocsCodeHero } from "../components/docs-code-hero";
import { DocsPageHeader } from "../components/docs-page-header";
import { RegisterDocsToc } from "../components/register-docs-toc";

export const metadata = createMetadata({
  title: "Getting started",
  description: "Create a project, generate API keys, and send your first feedback.",
  path: "/docs/getting-started",
});

const SECTIONS: readonly DocsTocSection[] = [
  { id: "1-create-a-project", label: "1. Create a project" },
  { id: "2-generate-api-keys", label: "2. Generate API keys" },
  { id: "3-send-your-first-feedback", label: "3. Send your first feedback" },
  { id: "4-install-the-widget", label: "4. Install the widget" },
];

const GettingStartedPage = () => {
  const serverUrl = env.NEXT_PUBLIC_SERVER_URL;

  const curlExample = `curl -X POST ${serverUrl}/api/feedback \\
  -H "Authorization: Bearer echo_sk_your_secret_key" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Jane Smith", "feedback": "Love the product!"}'`;

  return (
    <div className="docs-page-stack">
      <RegisterDocsToc sections={SECTIONS} />

      <FadeIn>
        <DocsPageHeader
          title="Getting started"
          description="Four steps to your first piece of feedback."
          breadcrumb={["Setup", "Getting started"]}
        />
      </FadeIn>

      <FadeIn delay={0.05}>
        <DocsCodeHero code={curlExample} language="bash" />
      </FadeIn>

      <FadeIn delay={0.1}>
        <ol className="docs-steps-stack">
          <li>
            <h2 id="1-create-a-project" className="text-xl font-semibold tracking-tight">
              1. Create a project
            </h2>
            <p className="mt-2 text-muted-foreground">
              Sign up and create your first project from the dashboard. A project maps to
              one app or product you want to collect feedback for.
            </p>
          </li>

          <li>
            <h2 id="2-generate-api-keys" className="text-xl font-semibold tracking-tight">
              2. Generate API keys
            </h2>
            <p className="mt-2 text-muted-foreground">
              From{" "}
              <span className="inline-flex items-center gap-1 font-medium text-foreground">
                Collect <Icons.arrowRight className="size-3" /> API
              </span>{" "}
              in the dashboard, generate a key pair: a secret key (
              <InlineCode>echo_sk_…</InlineCode>) for writing feedback, and a publishable
              key (<InlineCode>echo_pk_…</InlineCode>) for reading it.
            </p>
          </li>

          <li>
            <h2
              id="3-send-your-first-feedback"
              className="text-xl font-semibold tracking-tight"
            >
              3. Send your first feedback
            </h2>
            <p className="mt-2 text-muted-foreground">
              Call the REST API with your secret key from any backend:
            </p>
            <div className="mt-3">
              <CodeBlock code={curlExample} language="bash" />
            </div>
          </li>

          <li>
            <h2 id="4-install-the-widget" className="text-xl font-semibold tracking-tight">
              4. Install the widget
            </h2>
            <p className="mt-2 text-muted-foreground">
              Prefer collecting feedback directly from your UI? See the{" "}
              <Link href="/docs/widget" className="font-medium text-foreground underline">
                Widget
              </Link>{" "}
              page to install a floating feedback button in minutes.
            </p>
          </li>
        </ol>
      </FadeIn>
    </div>
  );
};

export default GettingStartedPage;
