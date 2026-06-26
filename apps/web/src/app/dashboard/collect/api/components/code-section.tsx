"use client";

import { CodeBlock } from "@echo/ui/components/code-block";
import { cn } from "@echo/ui/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

type Tab = "post" | "get";

const REQUEST_FIELDS = [
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
] as const;

const MASKED_SECRET = `echo_sk_${"•".repeat(16)}`;

type CodeSectionProps = {
  serverUrl: string;
  publicKey: string | null;
};

export const CodeSection = ({
  serverUrl,
  publicKey,
}: CodeSectionProps): React.ReactElement => {
  const [tab, setTab] = useState<Tab>("post");

  const pk = publicKey ?? `echo_pk_${"•".repeat(16)}`;

  const postCode = `await fetch(
  "${serverUrl}/api/feedback",
  {
    method: "POST",
    headers: {
      "Authorization": "Bearer ${MASKED_SECRET}",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "Jane Smith",
      feedback: "Love the product!",
    }),
  }
)`;

  const getCode = `const res = await fetch(
  "${serverUrl}/api/feedback",
  { headers: { "Authorization": "Bearer ${pk}" } }
)

const { feedback } = await res.json()`;

  const postResponse = `{
  "success": true
}`;

  const getResponse = `{
  "feedback": [
    {
      "id": "fb_a1b2c3",
      "name": "Jane Smith",
      "feedback": "Love the product!",
      "rating": 5,
      "createdAt": "2026-06-24T10:00:00Z"
    }
  ]
}`;

  const isPost = tab === "post";

  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold">Integration</h2>
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
            Call <span className="font-mono text-foreground">/api/feedback</span> with
            Bearer auth.
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-border p-0.5">
          {(["post", "get"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className="relative rounded-md px-3 py-1 text-xs font-semibold uppercase tracking-wide"
            >
              {tab === t && (
                <motion.span
                  layoutId="api-method-tab"
                  className="absolute inset-0 rounded-md bg-foreground"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
              <span
                className={cn(
                  "relative z-10 transition-colors",
                  tab === t
                    ? "text-background"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t}
              </span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Request
              </p>
              <CodeBlock code={isPost ? postCode : getCode} language="ts" />
            </div>
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Response
              </p>
              <CodeBlock code={isPost ? postResponse : getResponse} language="json" />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {isPost && (
        <div className="mt-5">
          <p className="mb-3 text-xs font-semibold">Request body</p>
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-left">
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Field</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Type</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {REQUEST_FIELDS.map((f) => (
                  <tr key={f.name}>
                    <td className="px-4 py-2.5 font-mono text-xs">
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
    </section>
  );
};
