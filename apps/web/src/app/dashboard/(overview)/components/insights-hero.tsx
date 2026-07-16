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
import { Stagger, StaggerItem } from "@echo/ui/components/motion/stagger";
import { formatCount, formatRelativeTime } from "@echo/ui/lib/format";
import * as React from "react";

import type { DigestOutput } from "@echo/ai";

import { DigestModal } from "../../components/digest-modal";

type InsightsHeroProps = {
  readonly digest: DigestOutput | null;
  readonly generatedAt: Date | null;
  readonly feedbackCount: number;
  readonly className?: string;
};

function HeaderChip(): React.ReactElement {
  return (
    <span className="flex size-6 items-center justify-center rounded-md bg-accent/10">
      <Icons.aiMagic className="size-3.5 text-accent" />
    </span>
  );
}

function TopIssues({ issues }: { issues: readonly string[] }): React.ReactElement {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        What users want changed
      </p>
      <Stagger className="mt-2.5 flex flex-col gap-2" stagger={0.04}>
        {issues.map((issue) => (
          <StaggerItem
            key={issue}
            className="flex items-start gap-2 text-[13px] leading-snug text-foreground/85"
          >
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-destructive/80" />
            {issue}
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}

function MainThemes({ themes }: { themes: DigestOutput["themes"] }): React.ReactElement {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        Main themes
      </p>
      <Stagger className="mt-2.5 flex flex-col gap-2" stagger={0.04}>
        {themes.map((theme) => (
          <StaggerItem key={theme.title} className="flex items-start gap-2.5">
            <span className="mt-px min-w-6 rounded-md bg-muted px-1 py-0.5 text-center text-[11px] font-semibold tabular-nums text-muted-foreground">
              {theme.count}
            </span>
            <div className="min-w-0">
              <p className="text-[13px] font-medium leading-snug">{theme.title}</p>
              <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
                {theme.insight}
              </p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}

export function InsightsHero({
  digest,
  generatedAt,
  feedbackCount,
  className,
}: InsightsHeroProps): React.ReactElement {
  const [open, setOpen] = React.useState(false);
  const hasTopIssues = digest !== null && digest.topIssues.length > 0;
  const hasThemes = digest !== null && digest.themes.length > 0;
  const isEmpty = !digest || (!hasTopIssues && !hasThemes);

  if (isEmpty) {
    return (
      <>
        <Card className={className}>
          <CardContent className="flex flex-1 items-center justify-center py-10">
            <EmptyState
              icon={<Icons.aiMagic />}
              title="Your AI summary is one click away"
              description="Distill an executive summary, the top requested changes, and recurring
                themes from your feedback."
              action={
                <Button size="sm" onClick={() => setOpen(true)}>
                  <Icons.aiMagic data-icon="inline-start" className="size-4" />
                  Generate summary
                </Button>
              }
            />
          </CardContent>
        </Card>
        <DigestModal open={open} onOpenChange={setOpen} />
      </>
    );
  }

  return (
    <>
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HeaderChip />
            AI Summary
          </CardTitle>
          <CardAction>
            <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
              View full summary
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            {digest.executiveSummary}
          </p>

          <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {hasTopIssues && <TopIssues issues={digest.topIssues} />}
            {hasThemes && <MainThemes themes={digest.themes} />}
          </div>

          {digest.positiveHighlight && (
            <div className="flex items-start gap-2 border-t pt-4 text-[13px] leading-snug text-muted-foreground">
              <Icons.circleCheck className="mt-px size-4 shrink-0 text-success" />
              <span>
                <span className="font-medium text-foreground">Users love: </span>
                {digest.positiveHighlight}
              </span>
            </div>
          )}

          {generatedAt && (
            <p className="text-[11px] tabular-nums text-muted-foreground/70">
              {formatCount(feedbackCount)} feedback · updated{" "}
              {formatRelativeTime(generatedAt.toISOString())}
            </p>
          )}
        </CardContent>
      </Card>
      <DigestModal open={open} onOpenChange={setOpen} />
    </>
  );
}
