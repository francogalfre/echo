"use client";

import { trpc } from "@/lib/trpc";
import { useAsyncResource } from "@/lib/use-async-resource";

import type { ApiKeysInitialState } from "@/app/dashboard/hooks/use-api-keys";

import { ApiPageSkeleton } from "../api-page-skeleton";
import { ErrorCard } from "../../../../components/error-card";
import { ApiKeysContent } from "./api-keys-content";

type ApiKeysSectionProps = {
  readonly initial: ApiKeysInitialState;
};

export function ApiKeysSection({ initial }: ApiKeysSectionProps): React.ReactElement {
  const hasInitialKeys = "keys" in initial;
  const { state } = useAsyncResource(
    () => trpc.apiKeys.get.query(),
    hasInitialKeys ? { initialData: initial.keys } : undefined,
  );

  if (state.status === "loading") {
    return <ApiPageSkeleton />;
  }

  if (state.status === "error") {
    return (
      <ErrorCard
        title="Couldn't load your API keys"
        message="Something went wrong while fetching your keys."
        onRetry={state.retry}
        className="mx-auto max-w-md"
      />
    );
  }

  return <ApiKeysContent initialKeys={state.data} />;
}
