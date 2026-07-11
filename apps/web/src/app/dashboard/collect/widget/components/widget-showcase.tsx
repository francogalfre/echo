"use client";

import { CodeBlock } from "@echo/ui/components/code-block";
import { cn } from "@echo/ui/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { WidgetPreview } from "./widget-preview";

type Tab = "preview" | "code";

type WidgetShowcaseProps = {
  publicKey: string;
  serverUrl: string;
  accentColor: string;
  logoUrl: string | null;
  projectName: string;
};

export const WidgetShowcase = ({
  publicKey,
  serverUrl,
  accentColor,
  logoUrl,
  projectName,
}: WidgetShowcaseProps): React.ReactElement => {
  const [tab, setTab] = useState<Tab>("preview");

  const snippet = `'use client'

import { useState, type FormEvent } from 'react'

const ECHO_PUBLIC_KEY = '${publicKey}'
const ECHO_WIDGET_URL = '${serverUrl}/api/widget'
const ECHO_ACCENT = '${accentColor}'

export function EchoWidget({ position = 'right' }) {
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(null)
  const [comment, setComment] = useState('')

  async function handleSubmit() {
    await fetch(ECHO_WIDGET_URL, {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + ECHO_PUBLIC_KEY },
      body: JSON.stringify({ name: 'Anonymous', feedback: comment || 'Great', rating }),
    })
  }

  return (
    <div>
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon key={star} filled={star <= rating} color={ECHO_ACCENT} />
      ))}
    </div>
  )
}`;

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex items-center gap-1 border-b border-border px-4 py-2.5">
        {(["preview", "code"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className="relative rounded-md px-3 py-1.5 text-xs font-medium capitalize"
          >
            {tab === t && (
              <motion.span
                layoutId="showcase-tab"
                className="absolute inset-0 rounded-md bg-muted"
                transition={{ type: "spring", stiffness: 400, damping: 35 }}
              />
            )}
            <span
              className={cn(
                "relative z-10 transition-colors",
                tab === t ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {t}
            </span>
          </button>
        ))}
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {tab === "preview" ? (
              <WidgetPreview
                accentColor={accentColor}
                logoUrl={logoUrl}
                projectName={projectName}
              />
            ) : (
              <CodeBlock code={snippet} language="tsx" />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
