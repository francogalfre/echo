"use client";

import { Icons } from "@echo/ui/components/icons";
import { cn } from "@echo/ui/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

const STRING_TOKEN = /("(?:[^"\\]|\\.)*")/g;

function highlight(code: string): React.ReactNode[] {
  return code.split(STRING_TOKEN).map((part, i) =>
    part.startsWith('"') ? (
      <span key={i} className="text-emerald-300">
        {part}
      </span>
    ) : (
      <span key={i} className="text-zinc-300">
        {part}
      </span>
    ),
  );
}

type CodeBlockProps = {
  code: string;
  language?: string;
  highlightStrings?: boolean;
  className?: string;
};

export const CodeBlock = ({
  code,
  language = "tsx",
  highlightStrings = true,
  className,
}: CodeBlockProps): React.ReactElement => {
  const [copied, setCopied] = useState(false);

  const copy = (): void => {
    void navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl bg-zinc-950 ring-1 ring-white/5",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
          {language}
        </span>
        <button
          type="button"
          onClick={copy}
          aria-label="Copy code"
          className="flex size-6 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-white/5 hover:text-zinc-200"
        >
          {copied ? (
            <Icons.check className="size-3.5" />
          ) : (
            <Icons.copy className="size-3.5" />
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-[12px] leading-[1.7]">
        <code>{highlightStrings ? highlight(code) : code}</code>
      </pre>
    </div>
  );
};
