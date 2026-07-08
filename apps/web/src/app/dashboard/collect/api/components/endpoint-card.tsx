import { CodeBlock } from "@echo/ui/components/code-block";
import { cn } from "@echo/ui/lib/utils";

import { LanguageTabs, type LanguageSnippet } from "./language-tabs";

export type ParamField = {
  name: string;
  type: string;
  required: boolean;
  description: string;
};

type Method = "POST" | "GET";

type EndpointCardProps = {
  method: Method;
  path: string;
  description: string;
  params?: ParamField[];
  snippets: LanguageSnippet[];
  responseStatus: number;
  responseBody: string;
  note?: string;
};

const METHOD_STYLES: Record<Method, string> = {
  POST: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  GET: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
};

export const EndpointCard = ({
  method,
  path,
  description,
  params,
  snippets,
  responseStatus,
  responseBody,
  note,
}: EndpointCardProps): React.ReactElement => (
  <div className="rounded-2xl border border-border bg-card p-5">
    <div className="flex items-center gap-2.5">
      <span
        className={cn(
          "rounded-md px-2 py-1 text-xs font-bold tracking-wide",
          METHOD_STYLES[method],
        )}
      >
        {method}
      </span>
      <span className="font-mono text-sm text-foreground">{path}</span>
    </div>
    <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{description}</p>
    {note && <p className="mt-1 text-xs text-muted-foreground">{note}</p>}

    {params && params.length > 0 && (
      <div className="mt-5">
        <p className="mb-3 text-xs font-semibold">Parameters</p>
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-left">
                <th className="px-4 py-2.5 font-medium text-muted-foreground">Field</th>
                <th className="px-4 py-2.5 font-medium text-muted-foreground">Type</th>
                <th className="px-4 py-2.5 font-medium text-muted-foreground">Required</th>
                <th className="px-4 py-2.5 font-medium text-muted-foreground">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {params.map((field) => (
                <tr key={field.name}>
                  <td className="px-4 py-2.5 font-mono text-xs">{field.name}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{field.type}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {field.required ? "Yes" : "No"}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">{field.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}

    <div className="mt-5">
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Request
      </p>
      <LanguageTabs snippets={snippets} />
    </div>

    <div className="mt-4">
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Response · <span className="font-mono normal-case">{responseStatus}</span>
      </p>
      <CodeBlock code={responseBody} language="json" />
    </div>
  </div>
);
