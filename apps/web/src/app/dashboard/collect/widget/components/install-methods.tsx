"use client";

import { Badge } from "@echo/ui/components/badge";
import { CodeBlock } from "@echo/ui/components/code-block";
import { DOCS_TABLE_HEAD_CELL, DocsTable } from "@echo/ui/components/docs/docs-table";

type InstallMethodsProps = {
  orgSlug: string;
  serverUrl: string;
};

export const InstallMethods = ({
  orgSlug,
  serverUrl,
}: InstallMethodsProps): React.ReactElement => {
  const registryUrl = `${serverUrl}/api/widget/${orgSlug}/registry`;
  const componentUrl = `${serverUrl}/api/widget/${orgSlug}/component`;

  const usageCode = `import { EchoWidget } from '@/components/echo-widget'

export default function Layout({ children }) {
  return (
    <>
      {children}
      <EchoWidget position="right" />
    </>
  )
}`;

  return (
    <div className="space-y-4">
      <Step
        index={1}
        title="Install"
        badge="Recommended"
        description="Installs components/echo-widget.tsx using your existing shadcn primitives."
        code={`npx shadcn@latest add "${registryUrl}"`}
        language="bash"
        footnote="Auto-installs Button and Textarea if missing."
      />

      <Step
        index={2}
        title="Or install standalone"
        description="A single self-contained .tsx file with no dependencies beyond React and Tailwind."
        code={`curl -o components/echo-widget.tsx \\
  "${componentUrl}"`}
        language="bash"
      />

      <Step
        index={3}
        title="Use it"
        description="Import the component and drop it into your root layout."
        code={usageCode}
        language="tsx"
      >
        <PropsTable />
      </Step>
    </div>
  );
};

type StepProps = {
  index: number;
  title: string;
  badge?: string;
  description: string;
  code: string;
  language: string;
  footnote?: string;
  children?: React.ReactNode;
};

const Step = ({
  index,
  title,
  badge,
  description,
  code,
  language,
  footnote,
  children,
}: StepProps): React.ReactElement => (
  <section className="rounded-lg bg-card p-5 ring-1 ring-foreground/10">
    <div className="mb-1 flex items-center gap-2.5">
      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-muted-foreground">
        {index}
      </span>
      <h3 className="text-sm font-semibold">{title}</h3>
      {badge && (
        <Badge className="bg-pastel-green-bg text-pastel-green-text">{badge}</Badge>
      )}
    </div>
    <p className="mb-4 pl-[30px] text-xs leading-relaxed text-muted-foreground">
      {description}
    </p>
    <div className="pl-[30px]">
      <CodeBlock code={code} language={language} />
      {footnote && <p className="mt-3 text-xs text-muted-foreground">{footnote}</p>}
      {children}
    </div>
  </section>
);

const PropsTable = (): React.ReactElement => (
  <DocsTable className="mt-4">
    <thead>
      <tr className="border-b border-border bg-muted/30 text-left">
        <th className={DOCS_TABLE_HEAD_CELL}>Prop</th>
        <th className={DOCS_TABLE_HEAD_CELL}>Type</th>
        <th className={DOCS_TABLE_HEAD_CELL}>Default</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-border">
      <tr className="transition-colors hover:bg-muted/30">
        <td className="px-4 py-3 font-mono text-xs text-foreground">position</td>
        <td className="px-4 py-3 font-mono text-muted-foreground">'left' | 'right'</td>
        <td className="px-4 py-3 font-mono text-muted-foreground">'right'</td>
      </tr>
    </tbody>
  </DocsTable>
);
