import { CodeBlock } from "@echo/ui/components/code-block";
import { Icons } from "@echo/ui/components/icons";
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
  POST: "border border-accent/20 bg-accent/10 text-accent",
  GET: "border border-info/20 bg-info/10 text-info",
};

const TABLE_HEAD_CELL =
  "px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground";

function statusTone(status: number): string {
  if (status < 300) return "bg-success/10 text-success";
  if (status < 500) return "bg-warning/10 text-warning";
  return "bg-destructive/10 text-destructive";
}

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
          "rounded-md px-2 py-1 font-mono text-xs font-bold tracking-wide",
          METHOD_STYLES[method],
        )}
      >
        {method}
      </span>
      <span className="font-mono text-sm text-foreground">{path}</span>
    </div>
    <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{description}</p>
    {note && (
      <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icons.lock className="size-3 shrink-0" />
        {note}
      </p>
    )}

    {params && params.length > 0 && (
      <div className="mt-6">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Parameters
        </p>
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-left">
                <th className={TABLE_HEAD_CELL}>Field</th>
                <th className={TABLE_HEAD_CELL}>Type</th>
                <th className={TABLE_HEAD_CELL}>Required</th>
                <th className={TABLE_HEAD_CELL}>Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {params.map((field) => (
                <tr key={field.name}>
                  <td className="px-4 py-2.5 font-mono text-xs text-foreground">
                    {field.name}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-muted-foreground">
                    {field.type}
                  </td>
                  <td className="px-4 py-2.5">
                    {field.required ? (
                      <span className="font-medium text-foreground">Required</span>
                    ) : (
                      <span className="text-muted-foreground">Optional</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">{field.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}

    <div className="mt-6">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        Request
      </p>
      <LanguageTabs snippets={snippets} />
    </div>

    <div className="mt-5">
      <div className="mb-2 flex items-center gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Response
        </p>
        <span
          className={cn(
            "rounded-md px-1.5 py-0.5 font-mono text-[11px] font-semibold",
            statusTone(responseStatus),
          )}
        >
          {responseStatus}
        </span>
      </div>
      <CodeBlock code={responseBody} language="json" />
    </div>
  </div>
);
