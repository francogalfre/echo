"use client";

import { cn } from "@echo/ui/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

type Tab = "post" | "get";

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

const fields = [
  { name: "name", required: true, type: "string", description: "Reporter's name." },
  {
    name: "feedback",
    required: true,
    type: "string",
    description: "The feedback content.",
  },
  { name: "email", required: false, type: "string", description: "Reporter's email." },
  {
    name: "rating",
    required: false,
    type: "number",
    description: "Star rating from 1 to 5.",
  },
];

type CodeSectionProps = {
  serverUrl: string;
  publicKey: string | null;
};

export const CodeSection = ({
  serverUrl,
  publicKey,
}: CodeSectionProps): React.ReactElement => {
  const [tab, setTab] = useState<Tab>("post");

  const sk = `echo_sk_${"•".repeat(16)}`;
  const pk = publicKey ?? `echo_pk_${"•".repeat(16)}`;

  const postCode = `const response = await fetch(
  "${serverUrl}/api/feedback",
  {
    method: "POST",
    headers: {
      "Authorization": "Bearer ${sk}",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "Jane Smith",
      feedback: "Love the product!",
    }),
  }
)`;

  const getCode = `const response = await fetch(
  "${serverUrl}/api/feedback",
  {
    headers: {
      "Authorization": "Bearer ${pk}",
    },
  }
)

const { feedback } = await response.json()`;

  const activeCode = tab === "post" ? postCode : getCode;

  const copy = (): void => {
    void navigator.clipboard.writeText(activeCode);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold">Integration</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Call <span className="font-mono text-foreground">/api/feedback</span> from your
            backend using Bearer auth.
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-border p-0.5">
          {(["post", "get"] as const).map((t) => (
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
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="relative mt-4 overflow-hidden rounded-xl bg-zinc-950">
        <button
          type="button"
          onClick={copy}
          className="absolute right-3 top-3 flex h-7 items-center gap-1.5 rounded-lg bg-zinc-800 px-2.5 text-[11px] text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
        >
          Copy
        </button>
        <pre className="overflow-x-auto p-5 text-[12px] leading-[1.75]">
          <code>{highlight(activeCode)}</code>
        </pre>
      </div>

      {tab === "post" && (
        <div className="mt-5">
          <p className="mb-3 text-xs font-semibold">Request body</p>
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                    Field
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                    Type
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {fields.map((f) => (
                  <tr key={f.name}>
                    <td className="px-4 py-2.5 font-mono text-[11px]">
                      {f.name}
                      {f.required && <span className="ml-0.5 text-destructive">*</span>}
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">{f.type}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{f.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
