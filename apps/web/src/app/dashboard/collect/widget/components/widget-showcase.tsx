"use client";

import { cn } from "@echo/ui/lib/utils";
import { useState } from "react";

import { CodeBlock } from "../../components/code-block";
import { WidgetPreview } from "./widget-preview";

type Tab = "preview" | "code";

type WidgetShowcaseProps = {
  publicKey: string;
  serverUrl: string;
};

export const WidgetShowcase = ({
  publicKey,
  serverUrl,
}: WidgetShowcaseProps): React.ReactElement => {
  const [tab, setTab] = useState<Tab>("preview");

  const snippet = `'use client'

import { useState, type FormEvent } from 'react'

const ECHO_PUBLIC_KEY = '${publicKey}'
const ECHO_WIDGET_URL = '${serverUrl}/api/widget'

export function EchoWidget({ position = 'right' }) {
  const [open, setOpen] = useState(false)

  // Floating button toggles a slide-in panel
  // that POSTs { name, feedback } to ECHO_WIDGET_URL.
  return null
}`;

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex items-center gap-1 border-b border-border px-3 py-2">
        {(["preview", "code"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "rounded-md px-3 py-1 text-xs font-medium capitalize transition-colors",
              tab === t
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="p-4">
        {tab === "preview" ? (
          <WidgetPreview />
        ) : (
          <CodeBlock code={snippet} language="tsx" />
        )}
      </div>
    </section>
  );
};
