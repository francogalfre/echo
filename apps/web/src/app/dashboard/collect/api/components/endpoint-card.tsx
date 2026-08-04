import { Badge } from "@echo/ui/components/badge";
import { CodeBlock } from "@echo/ui/components/code-block";
import { Icons } from "@echo/ui/components/icons";
import { cn } from "@echo/ui/lib/utils";

import { LanguageTabs, type LanguageSnippet } from "./language-tabs";
import { statusTone, TABLE_HEAD_CELL } from "./table-styles";

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

const METHOD_TONE: Record<Method, string> = {
  POST: "bg-pastel-violet-bg text-pastel-violet-text",
  GET: "bg-pastel-blue-bg text-pastel-blue-text",
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
  <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
    <div className="flex items-center gap-2.5">
      <Badge className={cn(METHOD_TONE[method], "font-mono font-bold uppercase")}>
        {method}
      </Badge>
      <span className="font-mono text-sm text-foreground">{path}</span>
    </div>
    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
    {note && (
      <p className="mt-2.5 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icons.lock className="size-3 shrink-0" />
        {note}
      </p>
    )}

    {params && params.length > 0 && (
      <div className="mt-8">
        <p className="mb-3 text-[11px] font-semibold text-muted-foreground">Parameters</p>
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
                <tr key={field.name} className="transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-xs text-foreground">
                    {field.name}
                  </td>
                  <td className="px-4 py-3 font-mono text-muted-foreground">
                    {field.type}
                  </td>
                  <td className="px-4 py-3">
                    {field.required ? (
                      <span className="font-medium text-foreground">Required</span>
                    ) : (
                      <span className="text-muted-foreground">Optional</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{field.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}

    <div className="mt-8">
      <p className="mb-2.5 text-[11px] font-semibold text-muted-foreground">Request</p>
      <LanguageTabs snippets={snippets} />
    </div>

    <div className="mt-6">
      <div className="mb-2.5 flex items-center gap-2">
        <p className="text-[11px] font-semibold text-muted-foreground">Response</p>
        <Badge className={cn(statusTone(responseStatus), "font-mono tabular-nums")}>
          {responseStatus}
        </Badge>
      </div>
      <CodeBlock code={responseBody} language="json" />
    </div>
  </div>
);
