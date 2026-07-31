"use client";

import { env } from "@echo/env/web";
import { Button } from "@echo/ui/components/button";
import { EmptyState } from "@echo/ui/components/empty-state";
import { FadeIn } from "@echo/ui/components/fade-in";
import { Icons } from "@echo/ui/components/icons";

import { DocsHeader } from "../../../components/docs-header";
import { SectionHeading } from "../../../components/section-heading";
import { useApiKeys, type ApiKeysInitial } from "../../hooks/use-api-keys";
import { ApiHero } from "../api-hero";
import { AuthSection } from "../auth-section";
import { EndpointCard } from "../endpoint-card";
import { ErrorTable } from "../error-table";
import { SectionNav } from "../section-nav";
import {
  buildCreateSnippets,
  buildListSnippets,
  CREATE_FEEDBACK_PARAMS,
  CREATE_RESPONSE,
  LIST_RESPONSE,
  SECTIONS,
} from "./build-snippets";

type ApiKeysSectionProps = {
  readonly initialData: ApiKeysInitial;
};

export function ApiKeysSection({ initialData }: ApiKeysSectionProps): React.ReactElement {
  const { keys, pending, generate, roll, revoke } = useApiKeys(initialData);
  const serverUrl = env.NEXT_PUBLIC_SERVER_URL;

  if (keys.length === 0) {
    return (
      <EmptyState
        icon={<Icons.lock />}
        title="No API keys yet"
        description="Generate a publishable and secret key pair to start sending feedback."
        className="mx-auto max-w-md py-20"
        action={
          <Button size="sm" onClick={generate} disabled={pending?.action === "generate"}>
            {pending?.action === "generate" ? (
              <Icons.loading className="size-3.5 animate-spin" />
            ) : null}
            Generate API keys
          </Button>
        }
      />
    );
  }

  const pk = keys[0]?.publicKey ?? `echo_pk_${"•".repeat(16)}`;
  const createSnippets = buildCreateSnippets(serverUrl);
  const listSnippets = buildListSnippets(serverUrl, pk);

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
        <ApiHero request={createSnippets[0]?.code ?? ""} response={CREATE_RESPONSE} />
      </FadeIn>

      <div className="lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-16">
        <SectionNav sections={SECTIONS} className="hidden lg:block" />

        <div className="space-y-20">
          <FadeIn delay={0.1}>
            <section id="authentication">
              <AuthSection
                keys={keys}
                onRoll={roll}
                onRevoke={revoke}
                rollingId={pending?.action === "roll" ? pending.id : null}
                revokingId={pending?.action === "revoke" ? pending.id : null}
              />
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
                responseBody={CREATE_RESPONSE}
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
                responseBody={LIST_RESPONSE}
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
