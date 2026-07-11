import { CodeBlock } from "@echo/ui/components/code-block";
import { cn } from "@echo/ui/lib/utils";
import type { CSSProperties } from "react";

type DocsCodeHeroProps = {
  code: string;
  language?: string;
  className?: string;
};

const GRADIENT_STYLE: CSSProperties = {
  backgroundImage: [
    "radial-gradient(ellipse 70% 70% at 10% 0%, color-mix(in oklch, var(--accent) 18%, transparent), transparent 60%)",
    "radial-gradient(ellipse 65% 65% at 100% 100%, color-mix(in oklch, var(--accent) 12%, transparent), transparent 65%)",
  ].join(", "),
};

export const DocsCodeHero = ({
  code,
  language,
  className,
}: DocsCodeHeroProps): React.ReactElement => {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-border p-6 sm:p-8",
        className,
      )}
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10" style={GRADIENT_STYLE} />
      <CodeBlock code={code} language={language} className="shadow-md" />
    </div>
  );
};
