import { Badge } from "@echo/ui/components/badge";
import { CodeBlock } from "@echo/ui/components/code-block";
import { Icons } from "@echo/ui/components/icons";
import { cn } from "@echo/ui/lib/utils";

import { DOCS_TABLE_HEAD_CELL, DocsTable, statusTone } from "./docs-table";
import { MethodBadge, type HttpMethod } from "./method-badge";

export type EndpointParam = {
  name: string;
  type: string;
  required: boolean;
  description: string;
};

export type EndpointSnippet = {
  label: string;
  language: string;
  code: string;
};

type EndpointCardProps = {
  method: HttpMethod;
  path: string;
  description: string;
  note?: string;
  params?: readonly EndpointParam[];
  snippets: readonly EndpointSnippet[];
  responseStatus: number;
  responseBody: string;
  className?: string;
};

export function EndpointCard({
  method,
  path,
  description,
  note,
  params,
  snippets,
  responseStatus,
  responseBody,
  className,
}: EndpointCardProps): React.ReactElement {
  return (
    <div
      className={cn("rounded-lg bg-card p-6 ring-1 ring-foreground/10 sm:p-8", className)}
    >
      <div className="flex items-center gap-2.5">
        <MethodBadge method={method} />
        <span className="font-mono text-sm text-foreground">{path}</span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
      {note ? (
        <p className="mt-2.5 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Icons.lock className="size-3 shrink-0" />
          {note}
        </p>
      ) : null}

      {params && params.length > 0 ? (
        <div className="mt-8">
          <p className="micro-label mb-3">Parameters</p>
          <DocsTable>
            <thead>
              <tr className="border-b border-border bg-muted/30 text-left">
                <th className={DOCS_TABLE_HEAD_CELL}>Field</th>
                <th className={DOCS_TABLE_HEAD_CELL}>Type</th>
                <th className={DOCS_TABLE_HEAD_CELL}>Required</th>
                <th className={DOCS_TABLE_HEAD_CELL}>Description</th>
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
          </DocsTable>
        </div>
      ) : null}

      <div className="mt-8">
        <p className="micro-label mb-2.5">Request</p>
        <CodeBlock tabs={[...snippets]} />
      </div>

      <div className="mt-6">
        <div className="mb-2.5 flex items-center gap-2">
          <p className="micro-label">Response</p>
          <Badge className={cn(statusTone(responseStatus), "font-mono tabular-nums")}>
            {responseStatus}
          </Badge>
        </div>
        <CodeBlock code={responseBody} language="json" />
      </div>
    </div>
  );
}
