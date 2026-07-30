"use client";

import { Button } from "@echo/ui/components/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@echo/ui/components/card";
import { EmptyState } from "@echo/ui/components/empty-state";
import { Icons } from "@echo/ui/components/icons";
import { formatCount, formatRelativeTime } from "@echo/ui/lib/format";
import * as React from "react";

import type { DigestOutput } from "@echo/ai";

import { DigestModal } from "../../components/digest-modal";
import { DIGEST_SECTIONS, getDigestSectionSummary } from "../../components/agent-personas";

type InsightsHeroProps = {
  readonly digest: DigestOutput | null;
  readonly generatedAt: Date | null;
  readonly feedbackCount: number;
  readonly className?: string;
};

function EmptyDigestState({
  onGenerate,
  className,
}: {
  onGenerate: () => void;
  className?: string;
}): React.ReactElement {
  return (
    <Card className={className}>
      <CardContent className="flex flex-1 items-center justify-center py-12">
        <EmptyState
          icon={<Icons.aiMagic />}
          title="No insights yet"
          description="Generate an AI analysis to understand your feedback."
          action={
            <Button size="sm" onClick={onGenerate}>
              <Icons.aiMagic data-icon="inline-start" className="size-4" />
              Generate insights
            </Button>
          }
        />
      </CardContent>
    </Card>
  );
}

function DigestSummaryCard({
  digest,
  generatedAt,
  feedbackCount,
  onViewFull,
  className,
}: {
  digest: DigestOutput;
  generatedAt: Date | null;
  feedbackCount: number;
  onViewFull: () => void;
  className?: string;
}): React.ReactElement {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icons.aiMagic className="size-4 text-accent" />
          AI Analysis
        </CardTitle>
        <CardAction>
          <Button variant="ghost" size="sm" onClick={onViewFull}>
            View full analysis
            <Icons.arrowRight className="size-3.5" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 divide-x divide-border rounded-lg border border-border bg-background">
          {DIGEST_SECTIONS.map((section) => (
            <div key={section.id} className="flex items-center gap-2 px-4 py-3">
              <section.icon className="size-4 shrink-0 text-muted-foreground" />
              <p className="min-w-0 truncate text-xs text-muted-foreground">
                {getDigestSectionSummary(section.id, digest)}
              </p>
            </div>
          ))}
        </div>

        {digest.positiveHighlight && (
          <div className="mt-4 flex items-start gap-2.5 rounded-lg bg-success/8 px-3.5 py-3">
            <Icons.circleCheck className="mt-0.5 size-3.5 shrink-0 text-success" />
            <p className="text-sm text-muted-foreground">{digest.positiveHighlight}</p>
          </div>
        )}

        {generatedAt && (
          <p className="mt-3 text-xs text-muted-foreground">
            {formatCount(feedbackCount)} feedback · updated{" "}
            {formatRelativeTime(generatedAt.toISOString())}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function InsightsHero({
  digest,
  generatedAt,
  feedbackCount,
  className,
}: InsightsHeroProps): React.ReactElement {
  const [open, setOpen] = React.useState(false);
  const hasContent =
    digest !== null &&
    (digest.topIssues.length > 0 || digest.themes.length > 0 || digest.positiveHighlight);

  if (!hasContent) {
    return (
      <>
        <EmptyDigestState className={className} onGenerate={() => setOpen(true)} />
        <DigestModal open={open} onOpenChange={setOpen} />
      </>
    );
  }

  return (
    <>
      <DigestSummaryCard
        className={className}
        digest={digest}
        generatedAt={generatedAt}
        feedbackCount={feedbackCount}
        onViewFull={() => setOpen(true)}
      />
      <DigestModal open={open} onOpenChange={setOpen} />
    </>
  );
}
