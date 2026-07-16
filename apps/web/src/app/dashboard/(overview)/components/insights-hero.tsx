"use client";

import { Button } from "@echo/ui/components/button";
import { EmptyState } from "@echo/ui/components/empty-state";
import { Icons } from "@echo/ui/components/icons";
import { Stagger, StaggerItem } from "@echo/ui/components/motion/stagger";
import { formatCount, formatRelativeTime } from "@echo/ui/lib/format";
import * as React from "react";

import type { DigestOutput } from "@echo/ai";

import { DigestModal } from "../../components/digest-modal";

type InsightsHeroProps = {
  readonly digest: DigestOutput | null;
  readonly generatedAt: Date | null;
  readonly feedbackCount: number;
};

type EmptyHeroProps = {
  readonly onGenerate: () => void;
};

function InsightsHeroEmpty({ onGenerate }: EmptyHeroProps): React.ReactElement {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-pastel-violet-bg/50 via-card to-pastel-blue-bg/30 p-6 ring-1 ring-foreground/10 sm:p-10">
      <EmptyState
        icon={<Icons.aiMagic />}
        title="Your AI summary is one click away"
        description="Generate an executive summary, the top requested changes, and recurring
          themes distilled from your feedback."
        action={
          <Button onClick={onGenerate}>
            <Icons.aiMagic data-icon="inline-start" className="size-4" />
            Generate first summary
          </Button>
        }
      />
    </div>
  );
}

export function InsightsHero({
  digest,
  generatedAt,
  feedbackCount,
}: InsightsHeroProps): React.ReactElement {
  const [open, setOpen] = React.useState(false);
  const hasTopIssues = digest !== null && digest.topIssues.length > 0;
  const hasThemes = digest !== null && digest.themes.length > 0;
  const isEmpty = !digest || (!hasTopIssues && !hasThemes);

  if (isEmpty) {
    return (
      <>
        <InsightsHeroEmpty onGenerate={() => setOpen(true)} />
        <DigestModal open={open} onOpenChange={setOpen} />
      </>
    );
  }

  return (
    <>
      <div className="rounded-2xl bg-gradient-to-br from-pastel-violet-bg/40 via-card to-pastel-blue-bg/20 p-6 ring-1 ring-foreground/10 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent/10">
              <Icons.aiMagic className="size-4 text-accent" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                AI Summary
              </p>
              {generatedAt && (
                <p className="text-xs tabular-nums text-muted-foreground/80">
                  {formatCount(feedbackCount)} feedbacks ·{" "}
                  {formatRelativeTime(generatedAt.toISOString())}
                </p>
              )}
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
            View full summary
            <Icons.arrowRight data-icon="inline-end" className="size-3.5" />
          </Button>
        </div>

        <p className="mt-6 text-balance text-lg font-medium leading-relaxed text-foreground sm:text-xl">
          {digest.executiveSummary}
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr_240px]">
          {hasTopIssues && (
            <div>
              <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                What users want changed
              </p>
              <Stagger className="flex flex-col gap-1.5" stagger={0.05}>
                {digest.topIssues.map((issue) => (
                  <StaggerItem
                    key={issue}
                    className="flex items-start gap-2 text-sm text-foreground/90"
                  >
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-destructive" />
                    {issue}
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          )}

          {hasThemes && (
            <div>
              <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Main themes
              </p>
              <Stagger className="flex flex-col gap-2" stagger={0.05}>
                {digest.themes.map((theme) => (
                  <StaggerItem
                    key={theme.title}
                    className="flex items-start gap-3 rounded-lg bg-muted/30 p-2.5"
                  >
                    <span className="mt-0.5 min-w-[1.75rem] rounded-full bg-muted px-1.5 py-0.5 text-center text-xs font-semibold tabular-nums text-muted-foreground">
                      {theme.count}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{theme.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {theme.insight}
                      </p>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          )}

          {digest.positiveHighlight && (
            <div className="rounded-xl bg-success/10 p-4 ring-1 ring-success/20">
              <p className="text-xs font-semibold uppercase tracking-wider text-success/80">
                What users love
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-success">
                {digest.positiveHighlight}
              </p>
            </div>
          )}
        </div>
      </div>
      <DigestModal open={open} onOpenChange={setOpen} />
    </>
  );
}
