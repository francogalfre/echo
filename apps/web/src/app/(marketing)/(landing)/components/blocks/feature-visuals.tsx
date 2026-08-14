"use client";

import codingCharacter from "@echo/assets/character/coding.webp";
import { Icons } from "@echo/ui/components/icons";
import { easings } from "@echo/ui/lib/motion";
import { m } from "motion/react";
import Image from "next/image";

export const cardTransition = { duration: 0.7, ease: easings.out } as const;

const inboxRows = [
  { author: "Lea Fischer", tone: "green", label: "Positive" },
  { author: "Dev Patel", tone: "slate", label: "Neutral" },
  { author: "Anon", tone: "rose", label: "Negative" },
  { author: "Marta Ruiz", tone: "green", label: "Positive" },
  { author: "Tom Alvarez", tone: "rose", label: "Negative" },
  { author: "Priya Nair", tone: "slate", label: "Neutral" },
  { author: "Jonas Weber", tone: "green", label: "Positive" },
  { author: "Sofia Marín", tone: "rose", label: "Negative" },
] as const;

const toneClass = {
  green: "bg-pastel-green-bg text-pastel-green-text",
  slate: "bg-pastel-slate-bg text-pastel-slate-text",
  rose: "bg-pastel-rose-bg text-pastel-rose-text",
} as const;

export const InboxVisual = (): React.ReactElement => {
  return (
    <div className="absolute inset-x-5 top-12 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="relative z-10 flex items-center gap-2 border-b border-border bg-card px-3.5 py-2.5">
        <Icons.message className="size-3.5 text-muted-foreground" />
        <span className="text-xs font-medium">Inbox</span>
        <span className="ml-auto flex items-center gap-1 text-[11px] text-success">
          <span className="size-1.5 rounded-full bg-success" />
          Live
        </span>
      </div>

      <div className="h-60 overflow-hidden">
        <m.div variants={{ rest: { y: 0 }, hover: { y: -96 } }} transition={cardTransition}>
          {inboxRows.map((row) => (
            <div
              key={row.author}
              className="flex h-12 items-center gap-2.5 border-b border-border px-3.5"
            >
              <span className="size-6 shrink-0 rounded-full bg-secondary" />
              <span className="min-w-0 flex-1 truncate text-xs">{row.author}</span>
              <span
                className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-medium ${toneClass[row.tone]}`}
              >
                {row.label}
              </span>
            </div>
          ))}
        </m.div>
      </div>
    </div>
  );
};

const digestLines = [
  "Billing errors up 3× after the plan switch",
  "Widget install called “two minutes” by 12 users",
  "CSV export is the top unmet request",
] as const;

export const DigestVisual = (): React.ReactElement => {
  return (
    <div className="absolute inset-x-5 top-1/2 grid -translate-y-1/2">
      <m.div
        variants={{ rest: { y: -22, rotate: 0 }, hover: { y: -52, rotate: -2.5 } }}
        transition={cardTransition}
        className="col-start-1 row-start-1 mx-6 rounded-xl border border-border bg-card"
      />

      <m.div
        variants={{ rest: { y: -11, rotate: 0 }, hover: { y: -28, rotate: -1.2 } }}
        transition={cardTransition}
        className="col-start-1 row-start-1 mx-3 rounded-xl border border-border bg-card"
      />

      <m.div
        variants={{ rest: { y: 0 }, hover: { y: 8 } }}
        transition={cardTransition}
        className="relative col-start-1 row-start-1 overflow-hidden rounded-xl border border-border bg-card shadow-sm"
      >
        <div className="flex items-center gap-2 border-b border-border px-3.5 py-2.5">
          <Icons.mail className="size-3.5 text-accent" />
          <span className="text-xs font-medium">Weekly summary</span>
          <span className="ml-auto text-[11px] text-muted-foreground">Mon 09:00</span>
        </div>
        <div className="space-y-2.5 p-3.5">
          {digestLines.map((line) => (
            <div key={line} className="flex gap-2">
              <span className="mt-1.5 size-1 shrink-0 rounded-full bg-accent" />
              <span className="text-xs leading-relaxed text-muted-foreground">{line}</span>
            </div>
          ))}
        </div>
      </m.div>
    </div>
  );
};

const themes = ["billing", "csv export", "onboarding"] as const;

export const AskVisual = (): React.ReactElement => {
  return (
    <>
      <m.div
        variants={{ rest: { y: 16 }, hover: { y: 0 } }}
        transition={cardTransition}
        className="pointer-events-none absolute -right-6 -bottom-6 w-36 sm:w-40"
      >
        <Image
          src={codingCharacter}
          alt=""
          sizes="(min-width: 640px) 160px, 144px"
          className="h-auto w-full"
          priority={false}
        />
      </m.div>

      <div className="absolute inset-x-5 top-10 space-y-3">
        <m.div
          variants={{ rest: { y: 0 }, hover: { y: -8 } }}
          transition={cardTransition}
          className="flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-3 shadow-sm"
        >
          <Icons.sparkles className="size-4 shrink-0 text-accent" />
          <span className="truncate text-xs">What broke for people this week?</span>
        </m.div>

        <m.div
          variants={{ rest: { y: 0 }, hover: { y: -14 } }}
          transition={cardTransition}
          className="mr-16 rounded-xl border border-border bg-card p-3.5 shadow-sm"
        >
          <p className="text-xs leading-relaxed text-muted-foreground">
            Nine users hit an error switching plans mid-cycle. Every report came through the
            widget, all on Tuesday.
          </p>

          <m.div
            variants={{ rest: {}, hover: { transition: { staggerChildren: 0.08 } } }}
            className="mt-3 flex flex-wrap gap-1.5"
          >
            {themes.map((theme) => (
              <m.span
                key={theme}
                variants={{ rest: { opacity: 0.5, y: 0 }, hover: { opacity: 1, y: -2 } }}
                transition={cardTransition}
                className="rounded-md bg-pastel-violet-bg px-2 py-0.5 font-mono text-[11px] text-pastel-violet-text"
              >
                {theme}
              </m.span>
            ))}
          </m.div>
        </m.div>
      </div>
    </>
  );
};
