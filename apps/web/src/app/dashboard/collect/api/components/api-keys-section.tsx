"use client";

import { env } from "@echo/env/web";
import { Button } from "@echo/ui/components/button";
import { EmptyState } from "@echo/ui/components/empty-state";
import { FadeIn } from "@echo/ui/components/fade-in";
import { Icons } from "@echo/ui/components/icons";

import { DocsHeader } from "../../components/docs-header";
import { SectionHeading } from "../../components/section-heading";
import { useApiKeys, type ApiKeysInitial } from "../hooks/use-api-keys";
import { ApiHero } from "./api-hero";
import { AuthSection } from "./auth-section";
import { EndpointCard, type ParamField } from "./endpoint-card";
import { ErrorTable } from "./error-table";
import type { LanguageSnippet } from "./language-tabs";
import { SectionNav, type NavSection } from "./section-nav";

const SECTIONS: readonly NavSection[] = [
  { id: "authentication", label: "Authentication" },
  { id: "create-feedback", label: "Create feedback" },
  { id: "list-feedback", label: "List feedback" },
  { id: "errors", label: "Errors" },
];

const CREATE_FEEDBACK_PARAMS: ParamField[] = [
  { name: "name", type: "string", required: true, description: "Reporter's name." },
  {
    name: "feedback",
    type: "string",
    required: true,
    description: "The feedback content.",
  },
  { name: "email", type: "string", required: false, description: "Reporter's email." },
  {
    name: "rating",
    type: "number",
    required: false,
    description: "Star rating from 1 to 5.",
  },
];

const MASKED_SECRET = `echo_sk_${"•".repeat(16)}`;

type ApiKeysSectionProps = {
  readonly initialData: ApiKeysInitial;
};

export function ApiKeysSection({ initialData }: ApiKeysSectionProps): React.ReactElement {
  const { state, pending, generate, roll } = useApiKeys(initialData);
  const serverUrl = env.NEXT_PUBLIC_SERVER_URL;

  if (state.status === "empty") {
    return (
      <EmptyState
        icon={<Icons.lock />}
        title="No API keys yet"
        description="Generate a publishable and secret key pair to start sending feedback."
        className="mx-auto max-w-md py-20"
        action={
          <Button size="sm" onClick={generate} disabled={pending === "generate"}>
            {pending === "generate" ? (
              <Icons.loading className="size-3.5 animate-spin" />
            ) : null}
            Generate API keys
          </Button>
        }
      />
    );
  }

  const pk = state.keys.publicKey || `echo_pk_${"•".repeat(16)}`;

  const createSnippets: LanguageSnippet[] = [
    {
      label: "cURL",
      language: "bash",
      code: `curl -X POST ${serverUrl}/api/feedback \\
  -H "Authorization: Bearer ${MASKED_SECRET}" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Jane Smith", "feedback": "Love the product!"}'`,
    },
    {
      label: "JavaScript",
      language: "js",
      code: `await fetch("${serverUrl}/api/feedback", {
  method: "POST",
  headers: {
    "Authorization": "Bearer ${MASKED_SECRET}",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "Jane Smith",
    feedback: "Love the product!",
  }),
})`,
    },
    {
      label: "Python",
      language: "python",
      code: `import requests

requests.post(
    "${serverUrl}/api/feedback",
    headers={
        "Authorization": "Bearer ${MASKED_SECRET}",
        "Content-Type": "application/json",
    },
    json={"name": "Jane Smith", "feedback": "Love the product!"},
)`,
    },
  ];

  const listSnippets: LanguageSnippet[] = [
    {
      label: "cURL",
      language: "bash",
      code: `curl ${serverUrl}/api/feedback \\
  -H "Authorization: Bearer ${pk}"`,
    },
    {
      label: "JavaScript",
      language: "js",
      code: `const res = await fetch("${serverUrl}/api/feedback", {
  headers: { "Authorization": "Bearer ${pk}" },
})

const { feedback } = await res.json()`,
    },
    {
      label: "Python",
      language: "python",
      code: `import requests

response = requests.get(
    "${serverUrl}/api/feedback",
    headers={"Authorization": "Bearer ${pk}"},
)

feedback = response.json()["feedback"]`,
    },
  ];

  const createResponse = `{
  "success": true
}`;

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
    <>
      <FadeIn>
        <DocsHeader
          eyebrow="REST API"
          title="API reference"
          description="Send feedback events straight from your backend with a single authenticated request."
          baseUrl={`${serverUrl}/api/feedback`}
        />
      </FadeIn>

      <FadeIn delay={0.05} className="mb-16">
        <ApiHero request={createSnippets[0]?.code ?? ""} response={createResponse} />
      </FadeIn>

      <div className="lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-16">
        <SectionNav sections={SECTIONS} className="hidden lg:block" />

        <div className="space-y-20">
          <FadeIn delay={0.1}>
            <section id="authentication">
              <AuthSection keys={state.keys} onRoll={roll} isRolling={pending === "roll"} />
            </section>
          </FadeIn>

          <FadeIn delay={0.15}>
            <section id="create-feedback">
              <SectionHeading title="Create feedback" description="Submit new feedback." />
              <EndpointCard
                method="POST"
                path="/api/feedback"
                description="Submit a new feedback entry for the authenticated project."
                note="Requires the secret key."
                params={CREATE_FEEDBACK_PARAMS}
                snippets={createSnippets}
                responseStatus={201}
                responseBody={createResponse}
              />
            </section>
          </FadeIn>

          <FadeIn delay={0.2}>
            <section id="list-feedback">
              <SectionHeading
                title="List feedback"
                description="Retrieve stored feedback."
              />
              <EndpointCard
                method="GET"
                path="/api/feedback"
                description="List feedback entries for the authenticated project."
                note="Requires the publishable key."
                snippets={listSnippets}
                responseStatus={200}
                responseBody={listResponse}
              />
            </section>
          </FadeIn>

          <FadeIn delay={0.25}>
            <section id="errors">
              <SectionHeading
                title="Errors"
                description="Status codes returned on failure."
              />
              <ErrorTable />
            </section>
          </FadeIn>
        </div>
      </div>
    </>
  );
}
