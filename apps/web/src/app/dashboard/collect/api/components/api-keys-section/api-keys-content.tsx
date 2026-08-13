"use client";

import { env } from "@echo/env/web";
import { DocsSectionHeading } from "@echo/ui/components/docs/docs-section";
import { DocsToc } from "@echo/ui/components/docs/docs-toc";
import { EndpointCard } from "@echo/ui/components/docs/endpoint-card";
import { FadeIn } from "@echo/ui/components/fade-in";

import { useApiKeys, type ApiKeysInitial } from "@/app/dashboard/hooks/use-api-keys";

import { ApiHero } from "../api-hero";
import { AuthSection } from "../auth-section";
import { DocsHeader } from "../../../components/docs-header";
import { ErrorTable } from "../error-table";
import {
  buildCreateSnippets,
  buildListSnippets,
  CREATE_FEEDBACK_PARAMS,
  CREATE_RESPONSE,
  LIST_RESPONSE,
  SECTIONS,
} from "./build-snippets";

type ApiKeysContentProps = {
  readonly initialKeys: ApiKeysInitial;
};

export function ApiKeysContent({ initialKeys }: ApiKeysContentProps): React.ReactElement {
  const { keys, pending, generate, roll, revoke } = useApiKeys(initialKeys);
  const serverUrl = env.NEXT_PUBLIC_SERVER_URL;

  const createSnippets = buildCreateSnippets(serverUrl);
  const listSnippets = buildListSnippets(serverUrl);

  return (
    <>
      <FadeIn>
        <DocsHeader
          eyebrow="REST API"
          title="API reference"
          description="Send feedback from your backend with one authenticated request."
          baseUrl={`${serverUrl}/api/feedback`}
          docsHref="/docs/api"
        />
      </FadeIn>

      <FadeIn delay={0.05} className="mb-14">
        <ApiHero request={createSnippets[0]?.code ?? ""} response={CREATE_RESPONSE} />
      </FadeIn>

      <div className="lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-16">
        <DocsToc sections={SECTIONS} layoutId="api-toc-active" className="mb-8 lg:mb-0" />

        <div className="space-y-14">
          <FadeIn delay={0.1}>
            <section id="authentication">
              <AuthSection
                keys={keys}
                onGenerate={generate}
                generating={pending?.action === "generate"}
                onRoll={roll}
                onRevoke={revoke}
                rollingId={pending?.action === "roll" ? pending.id : null}
                revokingId={pending?.action === "revoke" ? pending.id : null}
              />
            </section>
          </FadeIn>

          <FadeIn delay={0.15}>
            <section id="create-feedback">
              <DocsSectionHeading
                title="Create feedback"
                description="Submit new feedback."
              />
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

          <FadeIn delay={0.2}>
            <section id="list-feedback">
              <DocsSectionHeading
                title="List feedback"
                description="Retrieve stored feedback."
              />
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

          <FadeIn delay={0.25}>
            <section id="errors">
              <DocsSectionHeading
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
