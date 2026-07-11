import { env } from "@echo/env/web";
import { CodeBlock } from "@echo/ui/components/code-block";
import { Separator } from "@echo/ui/components/separator";

import { createMetadata } from "@/lib/metadata";

import { DocsPageHeader } from "../components/docs-page-header";

export const metadata = createMetadata({
  title: "REST API",
  description: "Authenticate and call the public feedback endpoints from your backend.",
  path: "/docs/api",
});

const ApiDocsPage = () => {
  const serverUrl = env.NEXT_PUBLIC_SERVER_URL;

  const createRequest = `curl -X POST ${serverUrl}/api/feedback \\
  -H "Authorization: Bearer echo_sk_your_secret_key" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Jane Smith", "feedback": "Love the product!"}'`;

  const createResponse = `{
  "success": true
}`;

  const listRequest = `curl ${serverUrl}/api/feedback \\
  -H "Authorization: Bearer echo_pk_your_publishable_key"`;

  const listResponse = `{
  "feedback": [
    {
      "id": "fb_a1b2c3",
      "name": "Jane Smith",
      "feedback": "Love the product!",
      "rating": 5,
      "createdAt": "2026-06-24T10:00:00Z"
    }
  ]
}`;

  return (
    <div className="space-y-12">
      <DocsPageHeader
        title="REST API"
        description="A small, authenticated API for sending and reading feedback from your own backend."
      />

      <section>
        <h2 className="text-lg font-semibold tracking-tight">Authentication</h2>
        <p className="mt-2 text-muted-foreground">
          Every request is authenticated with an API key sent as a bearer token:{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            Authorization: Bearer &lt;key&gt;
          </code>
          . Echo issues two key types per project:
        </p>
        <ul className="mt-3 space-y-2 text-muted-foreground">
          <li>
            <code className="rounded bg-muted px-1 py-0.5 text-xs">echo_sk_…</code> — secret
            key, used to write feedback. Keep this server-side only.
          </li>
          <li>
            <code className="rounded bg-muted px-1 py-0.5 text-xs">echo_pk_…</code> —
            publishable key, used to read feedback. Safe to expose in client code.
          </li>
        </ul>
      </section>

      <Separator />

      <section>
        <h2 className="text-lg font-semibold tracking-tight">Create feedback</h2>
        <p className="mt-2 text-muted-foreground">
          <span className="font-mono text-xs font-semibold text-foreground">POST</span>{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">/api/feedback</code> —
          requires the secret key. Body:{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            {"{ name, feedback, email?, rating? }"}
          </code>
          .
        </p>
        <div className="mt-3 space-y-3">
          <CodeBlock code={createRequest} language="bash" />
          <CodeBlock code={createResponse} language="json" />
        </div>
      </section>

      <Separator />

      <section>
        <h2 className="text-lg font-semibold tracking-tight">List feedback</h2>
        <p className="mt-2 text-muted-foreground">
          <span className="font-mono text-xs font-semibold text-foreground">GET</span>{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">/api/feedback</code> —
          requires the publishable key.
        </p>
        <div className="mt-3 space-y-3">
          <CodeBlock code={listRequest} language="bash" />
          <CodeBlock code={listResponse} language="json" />
        </div>
      </section>

      <Separator />

      <section>
        <h2 className="text-lg font-semibold tracking-tight">Errors</h2>
        <ul className="mt-3 space-y-2 text-muted-foreground">
          <li>
            <span className="font-mono text-xs font-semibold text-foreground">400</span> —
            the request body failed validation.
          </li>
          <li>
            <span className="font-mono text-xs font-semibold text-foreground">401</span> —
            the API key is missing or malformed.
          </li>
          <li>
            <span className="font-mono text-xs font-semibold text-foreground">403</span> —
            the key is valid but not allowed to perform this operation (e.g. a publishable
            key used to create feedback).
          </li>
        </ul>
      </section>
    </div>
  );
};

export default ApiDocsPage;
