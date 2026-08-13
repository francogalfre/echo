"use client";

import { Icons } from "@echo/ui/components/icons";
import { easings } from "@echo/ui/lib/motion";
import { motion } from "motion/react";

const ease = easings.out;

const inboxRows = [
  { author: "Lea Fischer", tone: "green", label: "Positive" },
  { author: "Dev Patel", tone: "slate", label: "Neutral" },
  { author: "Anon", tone: "rose", label: "Negative" },
  { author: "Marta Ruiz", tone: "green", label: "Positive" },
  { author: "Tom Alvarez", tone: "rose", label: "Negative" },
] as const;

const toneClass = {
  green: "bg-pastel-green-bg text-pastel-green-text",
  slate: "bg-pastel-slate-bg text-pastel-slate-text",
  rose: "bg-pastel-rose-bg text-pastel-rose-text",
} as const;

export const InboxVisual = (): React.ReactElement => {
  return (
    <div className="absolute inset-x-6 top-7 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center gap-2 border-b border-border px-3 py-2">
        <Icons.message className="size-3 text-muted-foreground" />
        <span className="text-[11px] font-medium">Inbox</span>
        <span className="ml-auto flex items-center gap-1 text-[10px] text-success">
          <span className="size-1.5 rounded-full bg-success" />
          Live
        </span>
      </div>

      <motion.div
        variants={{ rest: { y: 0 }, hover: { y: -44 } }}
        transition={{ duration: 0.7, ease }}
      >
        {inboxRows.map((row) => (
          <div
            key={row.author}
            className="flex h-11 items-center gap-2.5 border-b border-border px-3"
          >
            <span className="size-5 shrink-0 rounded-full bg-secondary" />
            <span className="min-w-0 flex-1 truncate text-[11px]">{row.author}</span>
            <span
              className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-medium ${toneClass[row.tone]}`}
            >
              {row.label}
            </span>
          </div>
        ))}
      </motion.div>
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
    <div className="absolute inset-x-6 top-8 grid">
      <motion.div
        variants={{
          rest: { y: 0, rotate: 0, scale: 0.94, opacity: 0 },
          hover: { y: -18, rotate: -3.5, scale: 0.96, opacity: 1 },
        }}
        transition={{ duration: 0.55, ease }}
        className="col-start-1 row-start-1 rounded-xl border border-border bg-card"
      />

      <motion.div
        variants={{ rest: { y: 0 }, hover: { y: 10 } }}
        transition={{ duration: 0.55, ease }}
        className="col-start-1 row-start-1 overflow-hidden rounded-xl border border-border bg-card shadow-sm"
      >
        <div className="flex items-center gap-2 border-b border-border px-3 py-2">
          <Icons.mail className="size-3 text-accent" />
          <span className="text-[11px] font-medium">Weekly summary</span>
          <span className="ml-auto text-[10px] text-muted-foreground">Mon 09:00</span>
        </div>
        <div className="space-y-2 p-3">
          {digestLines.map((line) => (
            <div key={line} className="flex gap-2">
              <span className="mt-1.5 size-1 shrink-0 rounded-full bg-accent" />
              <span className="text-[11px] leading-relaxed text-muted-foreground">
                {line}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

const themes = ["billing", "csv export", "onboarding"] as const;

export const AskVisual = (): React.ReactElement => {
  return (
    <div className="absolute inset-x-6 top-8 space-y-2.5">
      <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 shadow-sm">
        <Icons.sparkles className="size-3.5 shrink-0 text-accent" />
        <span className="truncate text-[11px]">What broke for people this week?</span>
      </div>

      <div className="rounded-xl border border-border bg-card p-3 shadow-sm">
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          Nine users hit an error switching plans mid-cycle. Every report came through the
          widget, all on Tuesday.
        </p>

        <motion.div
          variants={{ rest: {}, hover: { transition: { staggerChildren: 0.06 } } }}
          className="mt-2.5 flex flex-wrap gap-1.5"
        >
          {themes.map((theme) => (
            <motion.span
              key={theme}
              variants={{
                rest: { opacity: 0.6, y: 4 },
                hover: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.4, ease }}
              className="rounded-md bg-pastel-violet-bg px-2 py-0.5 font-mono text-[10px] text-pastel-violet-text"
            >
              {theme}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
