"use client";

import { cn } from "@echo/ui/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

type StandaloneTab = "curl" | "code";

type Props = {
  publicKey: string;
  orgSlug: string;
  serverUrl: string;
};

function highlight(code: string): React.ReactNode[] {
  return code.split(/("(?:[^"\\]|\\.)*")/g).map((part, i) =>
    part.startsWith('"') ? (
      <span key={i} className="text-emerald-400">
        {part}
      </span>
    ) : (
      <span key={i} className="text-zinc-300">
        {part}
      </span>
    ),
  );
}

function CodeBlock({
  code,
  language = "tsx",
}: {
  code: string;
  language?: string;
}): React.ReactElement {
  const copy = (): void => {
    void navigator.clipboard.writeText(code);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="relative overflow-hidden rounded-xl bg-zinc-950">
      <button
        type="button"
        onClick={copy}
        className="absolute right-3 top-3 flex h-7 items-center gap-1.5 rounded-lg bg-zinc-800 px-2.5 text-[11px] text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
      >
        Copy
      </button>
      <pre className="overflow-x-auto p-5 text-[12px] leading-[1.75]">
        <code>
          {language === "tsx" ? (
            highlight(code)
          ) : (
            <span className="text-zinc-300">{code}</span>
          )}
        </code>
      </pre>
    </div>
  );
}

function ShadcnSection({
  orgSlug,
  serverUrl,
}: {
  orgSlug: string;
  serverUrl: string;
}): React.ReactElement {
  const registryUrl = `${serverUrl}/api/widget/${orgSlug}/registry`;
  const installCommand = `npx shadcn@latest add "${registryUrl}"`;

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-1 flex items-center gap-2">
        <h2 className="text-sm font-semibold">shadcn/ui</h2>
        <span className="rounded-md bg-violet-100 px-1.5 py-0.5 text-[10px] font-semibold text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
          Recommended for Next.js
        </span>
      </div>
      <p className="mb-4 text-xs text-muted-foreground">
        Installs{" "}
        <span className="font-mono text-foreground">components/echo-widget.tsx</span> using
        your existing shadcn primitives.
      </p>

      <CodeBlock code={installCommand} language="bash" />

      <p className="mt-3 text-xs text-muted-foreground">
        Requires shadcn/ui · auto-installs Button, Input, Label, and Textarea if missing.
      </p>
    </div>
  );
}

function StandaloneSection({
  orgSlug,
  serverUrl,
  publicKey,
}: {
  orgSlug: string;
  serverUrl: string;
  publicKey: string;
}): React.ReactElement {
  const [tab, setTab] = useState<StandaloneTab>("curl");

  const componentUrl = `${serverUrl}/api/widget/${orgSlug}/component`;
  const curlCommand = `curl -o components/echo-widget.tsx \\
  "${componentUrl}"`;

  const standalonePreview = `'use client'

import { useState, type FormEvent } from 'react'

const ECHO_PUBLIC_KEY = '${publicKey}'
const ECHO_WIDGET_URL = '${serverUrl}/api/widget'

export function EchoWidget({ position = 'right' }) {
  // ... floating button + slide-in panel with form
}`;

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-1">
        <h2 className="text-sm font-semibold">Standalone</h2>
      </div>
      <p className="mb-4 text-xs text-muted-foreground">
        A single self-contained <span className="font-mono text-foreground">.tsx</span> file
        with no external dependencies beyond React and Tailwind.
      </p>

      <div className="mb-3 flex items-center gap-1 w-fit rounded-lg border border-border p-0.5">
        {(["curl", "code"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "rounded-md px-3 py-1 text-[11px] font-semibold uppercase tracking-wide transition-colors",
              tab === t
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t === "curl" ? "curl" : "preview"}
          </button>
        ))}
      </div>

      {tab === "curl" ? (
        <CodeBlock code={curlCommand} language="bash" />
      ) : (
        <CodeBlock code={standalonePreview} language="tsx" />
      )}
    </div>
  );
}

export function WidgetInstallSection({
  publicKey,
  orgSlug,
  serverUrl,
}: Props): React.ReactElement {
  const usageCode = `import { EchoWidget } from '@/components/echo-widget'

// In your root layout (app/layout.tsx or pages/_app.tsx):
export default function Layout({ children }) {
  return (
    <>
      {children}
      <EchoWidget position="right" />
    </>
  )
}`;

  return (
    <div className="space-y-3">
      <ShadcnSection orgSlug={orgSlug} serverUrl={serverUrl} />
      <StandaloneSection orgSlug={orgSlug} serverUrl={serverUrl} publicKey={publicKey} />

      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-1 text-sm font-semibold">Usage</h2>
        <p className="mb-4 text-xs text-muted-foreground">
          Import the component and drop it into your root layout.
        </p>
        <CodeBlock code={usageCode} language="tsx" />
        <div className="mt-4 overflow-hidden rounded-xl border border-border">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                  Prop
                </th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                  Type
                </th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                  Default
                </th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2.5 font-mono text-[11px]">position</td>
                <td className="px-4 py-2.5 text-muted-foreground">
                  <span className="font-mono">'left' | 'right'</span>
                </td>
                <td className="px-4 py-2.5 text-muted-foreground font-mono">'right'</td>
                <td className="px-4 py-2.5 text-muted-foreground">
                  Side of the screen to anchor the button.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
