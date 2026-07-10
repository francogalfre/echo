"use client";

import { CodeBlock } from "@echo/ui/components/code-block";

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
  <section className="rounded-2xl border border-border bg-card p-5">
    <div className="mb-1 flex items-center gap-2.5">
      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-muted-foreground">
        {index}
      </span>
      <h2 className="text-sm font-semibold">{title}</h2>
      {badge && (
        <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
          {badge}
        </span>
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
  <div className="mt-4 overflow-hidden rounded-xl border border-border">
    <table className="w-full text-xs">
      <thead>
        <tr className="border-b border-border bg-muted/30 text-left">
          <th className="px-4 py-2.5 font-medium text-muted-foreground">Prop</th>
          <th className="px-4 py-2.5 font-medium text-muted-foreground">Type</th>
          <th className="px-4 py-2.5 font-medium text-muted-foreground">Default</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="px-4 py-2.5 font-mono text-xs">position</td>
          <td className="px-4 py-2.5 font-mono text-muted-foreground">'left' | 'right'</td>
          <td className="px-4 py-2.5 font-mono text-muted-foreground">'right'</td>
        </tr>
      </tbody>
    </table>
  </div>
);
