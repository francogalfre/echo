"use client";

import { env } from "@echo/env/web";
import { FadeIn } from "@echo/ui/components/fade-in";
import { Icons } from "@echo/ui/components/icons";
import { Skeleton } from "@echo/ui/components/skeleton";

import { PageContainer } from "../../components/page-container";
import { DocsHeader } from "../components/docs-header";
import { SectionHeading } from "../components/section-heading";
import { ApiHero } from "./components/api-hero";
import { AuthSection } from "./components/auth-section";
import { EndpointCard, type ParamField } from "./components/endpoint-card";
import { ErrorTable } from "./components/error-table";
import type { LanguageSnippet } from "./components/language-tabs";
import { SectionNav, type NavSection } from "./components/section-nav";
import { useApiKeys } from "./hooks/use-api-keys";

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

export default function CollectApiPage(): React.ReactElement {
  const { state, pending, generate, roll } = useApiKeys();
  const serverUrl = env.NEXT_PUBLIC_SERVER_URL;

  if (state.status === "loading") {
    return (
      <PageContainer>
        <ApiPageSkeleton />
      </PageContainer>
    );
  }

  if (state.status === "empty") {
    return (
      <PageContainer>
        <EmptyState onGenerate={generate} isGenerating={pending === "generate"} />
      </PageContainer>
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
    <PageContainer>
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
    </PageContainer>
  );
}

function EmptyState({
  onGenerate,
  isGenerating,
}: {
  onGenerate: () => void;
  isGenerating: boolean;
}): React.ReactElement {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-20 text-center">
      <div className="flex size-12 items-center justify-center rounded-xl border border-border bg-background">
        <Icons.lock className="size-5 text-muted-foreground" />
      </div>
      <h2 className="mt-5 text-sm font-semibold">No API keys yet</h2>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
        Generate a publishable and secret key pair to start sending feedback.
      </p>
      <button
        type="button"
        onClick={onGenerate}
        disabled={isGenerating}
        className="mt-7 flex h-9 items-center gap-2 rounded-lg bg-foreground px-4 text-sm font-semibold text-background transition-opacity active:scale-[0.96] hover:opacity-85 disabled:opacity-50"
      >
        {isGenerating ? <Icons.loading className="size-3.5 animate-spin" /> : null}
        Generate API keys
      </button>
    </div>
  );
}

function ApiPageSkeleton(): React.ReactElement {
  return (
    <div className="space-y-16" aria-hidden="true">
      <div className="rounded-2xl border border-border p-6 sm:p-8">
        <Skeleton className="mb-6 h-4 w-56" />
        <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto_1fr]">
          <Skeleton className="h-32 w-full rounded-lg" />
          <div className="hidden size-4 lg:block" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2.5">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3.5 w-full max-w-lg" />
          <Skeleton className="h-3.5 w-2/3 max-w-md" />
        </div>

        <Skeleton className="h-32 w-full rounded-xl" />

        <div className="rounded-2xl border border-border bg-card p-6">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="mt-1.5 h-3 w-72" />
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
