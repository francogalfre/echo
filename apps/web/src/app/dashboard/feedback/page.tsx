import { Suspense } from "react";

import {
  FEEDBACK_SOURCE_VALUES,
  SENTIMENT_VALUES as API_SENTIMENT_VALUES,
} from "@echo/api/types";

import { AiAnalysisButton } from "../components/ai/ai-analysis-button";
import { PageContainer } from "../components/layout/page-container";
import { PageHeader } from "../components/layout/page-header";
import { FeedbackListData } from "./components/feedback-list-data";
import { FeedbackListSkeleton } from "./components/feedback-list-skeleton";
import type { FeedbackFilters } from "./utils/map-feedback";

const SENTIMENT_VALUES = ["all", ...API_SENTIMENT_VALUES] as const;
const SOURCE_VALUES = ["all", ...FEEDBACK_SOURCE_VALUES] as const;

type SearchParams = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parseSentiment(
  value: string | string[] | undefined,
): FeedbackFilters["sentiment"] {
  const raw = firstValue(value);
  return (SENTIMENT_VALUES as readonly string[]).includes(raw ?? "")
    ? (raw as FeedbackFilters["sentiment"])
    : "all";
}

function parseSource(value: string | string[] | undefined): FeedbackFilters["source"] {
  const raw = firstValue(value);
  return (SOURCE_VALUES as readonly string[]).includes(raw ?? "")
    ? (raw as FeedbackFilters["source"])
    : "all";
}

function parseSearch(value: string | string[] | undefined): string {
  return firstValue(value) ?? "";
}

function parseFilters(searchParams: SearchParams): FeedbackFilters {
  return {
    sentiment: parseSentiment(searchParams.sentiment),
    source: parseSource(searchParams.source),
    search: parseSearch(searchParams.q),
  };
}

type FeedbackPageProps = {
  readonly searchParams: Promise<SearchParams>;
};

const FeedbackPage = async ({
  searchParams,
}: FeedbackPageProps): Promise<React.ReactElement> => {
  const filters = parseFilters(await searchParams);

  return (
    <PageContainer>
      <PageHeader
        title="Feedback"
        description="All feedback from your users in one place."
        actions={<AiAnalysisButton />}
      />
      <Suspense
        key={`${filters.sentiment}:${filters.source}:${filters.search}`}
        fallback={<FeedbackListSkeleton />}
      >
        <FeedbackListData filters={filters} />
      </Suspense>
    </PageContainer>
  );
};

export default FeedbackPage;
