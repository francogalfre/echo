"use client";

import { Button } from "@echo/ui/components/button";
import { EmptyState } from "@echo/ui/components/empty-state";
import { Icons } from "@echo/ui/components/icons";
import { useEffect, useState } from "react";

import { AiThinking } from "../ai-thinking";
import { ErrorCard } from "../../error-card";
import { UpgradeDialog } from "../../dialogs/upgrade-dialog";
import { useDigest, type DigestItem } from "../../../hooks/use-digest";
import { AnalysisContent } from "./analysis-content";
import { AnalysisHeader } from "./analysis-header";
import { DigestHistoryRow } from "./digest-history-row";
import { DigestSkeleton } from "./digest-summary";

const SECTION_THINKING_PHRASES = [
  "Thinking",
  "Reading feedback",
  "Finding patterns",
  "Understanding",
  "Cooking",
] as const;

type DigestModalProps = {
  onOpenChange: (open: boolean) => void;
};

export function DigestModal({ onOpenChange }: DigestModalProps): React.ReactElement {
  const { state, load, generate, history, upgradeReason, dismissUpgrade } = useDigest();
  const [lastReadyData, setLastReadyData] = useState<DigestItem | null>(null);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (state.status === "ready") setLastReadyData(state.data);
  }, [state]);

  const isGenerating = state.status === "generating";
  const isLoading = state.status === "loading";
  const data = state.status === "ready" ? state.data : isGenerating ? lastReadyData : null;

  return (
    <>
      <div className="flex h-full flex-col">
        <AnalysisHeader
          onClose={() => onOpenChange(false)}
          feedbackCount={data?.feedbackCount}
          generatedAt={data?.generatedAt}
          canRegenerate={data?.canRegenerate}
          isGenerating={isGenerating}
          onRegenerate={() => void generate()}
        />

        <div className="flex flex-1 flex-col overflow-y-auto px-6 py-6">
          {isGenerating && (
            <div className="m-auto">
              <AiThinking phrases={SECTION_THINKING_PHRASES} />
            </div>
          )}

          {isLoading && <DigestSkeleton />}

          {state.status === "error" && (
            <ErrorCard
              message="Could not load analysis. Please try again."
              onRetry={() => void load()}
            />
          )}

          {state.status === "idle" && !isLoading && (
            <EmptyState
              className="m-auto"
              icon={<Icons.aiMagic />}
              title="You don't have any analysis yet"
              description="I can go through your feedback and tell you what stands out."
              action={
                <Button size="sm" onClick={() => void generate()}>
                  <Icons.aiMagic data-icon="inline-start" className="size-3.5" />
                  Generate Analysis
                </Button>
              }
            />
          )}

          {data && !isGenerating && <AnalysisContent digest={data.digest} />}
        </div>

        <DigestHistoryRow history={history} />
      </div>
      <UpgradeDialog
        open={upgradeReason !== null}
        onOpenChange={(next) => {
          if (!next) dismissUpgrade();
        }}
        reason={upgradeReason ?? ""}
      />
    </>
  );
}
