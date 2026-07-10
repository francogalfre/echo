import { env } from "@echo/env/web";
import { CodeBlock } from "@echo/ui/components/code-block";
import Link from "next/link";

import { createMetadata } from "@/lib/metadata";

import { DocsPageHeader } from "../components/docs-page-header";

export const metadata = createMetadata({
  title: "Getting started",
  description: "Create a project, generate API keys, and send your first feedback.",
  path: "/docs/getting-started",
});

const GettingStartedPage = () => {
  const serverUrl = env.NEXT_PUBLIC_SERVER_URL;

  const curlExample = `curl -X POST ${serverUrl}/api/feedback \\
  -H "Authorization: Bearer echo_sk_your_secret_key" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Jane Smith", "feedback": "Love the product!"}'`;

  return (
    <div className="space-y-10">
      <DocsPageHeader
        title="Getting started"
        description="Four steps to your first piece of feedback."
      />

      <ol className="space-y-8">
        <li>
          <h2 className="text-lg font-semibold tracking-tight">1. Create a project</h2>
          <p className="mt-2 text-muted-foreground">
            Sign up and create your first project from the dashboard. A project maps to one
            app or product you want to collect feedback for.
          </p>
        </li>

        <li>
          <h2 className="text-lg font-semibold tracking-tight">2. Generate API keys</h2>
          <p className="mt-2 text-muted-foreground">
            From <span className="font-medium text-foreground">Collect → API</span> in the
            dashboard, generate a key pair: a secret key (
            <code className="rounded bg-muted px-1 py-0.5 text-xs">echo_sk_…</code>) for
            writing feedback, and a publishable key (
            <code className="rounded bg-muted px-1 py-0.5 text-xs">echo_pk_…</code>) for
            reading it.
          </p>
        </li>

        <li>
          <h2 className="text-lg font-semibold tracking-tight">
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
          <h2 className="text-lg font-semibold tracking-tight">4. Install the widget</h2>
          <p className="mt-2 text-muted-foreground">
            Prefer collecting feedback directly from your UI? See the{" "}
            <Link href="/docs/widget" className="font-medium text-foreground underline">
              Widget
            </Link>{" "}
            page to install a floating feedback button in minutes.
          </p>
        </li>
      </ol>
    </div>
  );
};

export default GettingStartedPage;
