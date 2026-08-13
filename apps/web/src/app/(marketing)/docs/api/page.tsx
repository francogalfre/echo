import { env } from "@echo/env/web";
import type { DocsTocSection } from "@echo/ui/components/docs/docs-toc";
import { EndpointCard, type EndpointSnippet } from "@echo/ui/components/docs/endpoint-card";
import { InlineCode } from "@echo/ui/components/docs/inline-code";
import { FadeIn } from "@echo/ui/components/fade-in";
import { Separator } from "@echo/ui/components/separator";

import { createMetadata } from "@/utils/metadata";

import {
  CREATE_FEEDBACK_PARAMS,
  CREATE_RESPONSE,
  LIST_RESPONSE,
} from "../../../dashboard/collect/api/components/api-keys-section/build-snippets";
import { ErrorTable } from "../../../dashboard/collect/api/components/error-table";
import { DocsCodeHero } from "../components/docs-code-hero";
import { DocsPageHeader } from "../components/docs-page-header";
import { RegisterDocsToc } from "../components/register-docs-toc";

export const metadata = createMetadata({
  title: "REST API",
  description: "Authenticate and call the public feedback endpoints from your backend.",
  path: "/docs/api",
});

const SECTIONS: readonly DocsTocSection[] = [
  { id: "authentication", label: "Authentication" },
  { id: "create-feedback", label: "Create feedback" },
  { id: "list-feedback", label: "List feedback" },
  { id: "errors", label: "Errors" },
];

function buildCreateSnippets(serverUrl: string): EndpointSnippet[] {
  return [
    {
      label: "cURL",
      language: "bash",
      code: `curl -X POST ${serverUrl}/api/feedback \\
  -H "Authorization: Bearer echo_sk_your_secret_key" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Jane Smith", "feedback": "Love the product!"}'`,
    },
    {
      label: "JavaScript",
      language: "js",
      code: `await fetch("${serverUrl}/api/feedback", {
  method: "POST",
  headers: {
    "Authorization": "Bearer echo_sk_your_secret_key",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "Jane Smith",
    feedback: "Love the product!",
  }),
})`,
    },
  ];
}

function buildListSnippets(serverUrl: string): EndpointSnippet[] {
  return [
    {
      label: "cURL",
      language: "bash",
      code: `curl ${serverUrl}/api/feedback \\
  -H "Authorization: Bearer echo_sk_your_secret_key"`,
    },
    {
      label: "JavaScript",
      language: "js",
      code: `const res = await fetch("${serverUrl}/api/feedback", {
  headers: { "Authorization": "Bearer echo_sk_your_secret_key" },
})

const { feedback } = await res.json()`,
    },
  ];
}

const ApiDocsPage = () => {
  const serverUrl = env.NEXT_PUBLIC_SERVER_URL;
  const createSnippets = buildCreateSnippets(serverUrl);
  const listSnippets = buildListSnippets(serverUrl);

  return (
    <div className="docs-page-stack">
      <RegisterDocsToc sections={SECTIONS} />

      <FadeIn>
        <DocsPageHeader
          title="REST API"
          description="A small, authenticated API for sending and reading feedback from your own backend."
          breadcrumb={["Reference", "REST API"]}
        />
      </FadeIn>

      <FadeIn delay={0.05}>
        <DocsCodeHero code={createSnippets[0]?.code ?? ""} language="bash" />
      </FadeIn>

      <FadeIn delay={0.1}>
        <section id="authentication">
          <h2 className="text-xl font-semibold tracking-tight">Authentication</h2>
          <p className="mt-2 text-muted-foreground">
            Every request is authenticated with an API key sent as a bearer token:{" "}
            <InlineCode>Authorization: Bearer &lt;key&gt;</InlineCode>. Echo issues two key
            types per project:
          </p>
          <ul className="mt-3 space-y-2 text-muted-foreground">
            <li>
              <InlineCode>echo_sk_…</InlineCode> — secret key, used to write feedback. Keep
              this server-side only.
            </li>
            <li>
              <InlineCode>echo_pk_…</InlineCode> — publishable key, used to read feedback.
              Safe to expose in client code.
            </li>
          </ul>
        </section>
      </FadeIn>

      <Separator />

      <FadeIn delay={0.15}>
        <section id="create-feedback">
          <h2 className="mb-5 text-xl font-semibold tracking-tight">Create feedback</h2>
          <EndpointCard
            method="POST"
            path="/api/feedback"
            description="Creates a feedback entry for the authenticated project."
            note="Requires the secret key."
            params={CREATE_FEEDBACK_PARAMS}
            snippets={createSnippets}
            responseStatus={201}
            responseBody={CREATE_RESPONSE}
          />
        </section>
      </FadeIn>

      <Separator />

      <FadeIn delay={0.2}>
        <section id="list-feedback">
          <h2 className="mb-5 text-xl font-semibold tracking-tight">List feedback</h2>
          <EndpointCard
            method="GET"
            path="/api/feedback"
            description="Lists feedback entries for the authenticated project."
            note="Requires the secret key."
            snippets={listSnippets}
            responseStatus={200}
            responseBody={LIST_RESPONSE}
          />
        </section>
      </FadeIn>

      <Separator />

      <FadeIn delay={0.25}>
        <section id="errors">
          <h2 className="mb-5 text-xl font-semibold tracking-tight">Errors</h2>
          <ErrorTable />
        </section>
      </FadeIn>
    </div>
  );
};

export default ApiDocsPage;
