"use client";

import { useEffect, useState } from "react";

type AiThinkingProps = {
  phrases: readonly string[];
  children?: React.ReactNode;
};

const PHRASE_INTERVAL_MS = 2000;

export function AiThinking({ phrases, children }: AiThinkingProps): React.ReactElement {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (phrases.length < 2) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % phrases.length);
    }, PHRASE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [phrases.length]);

  return (
    <div className="flex flex-col gap-4">
      <div
        role="status"
        aria-live="polite"
        className="flex items-center gap-2.5 text-sm font-medium text-muted-foreground"
      >
        <span className="flex items-center gap-1">
          <span className="size-1.5 animate-pulse rounded-full bg-muted-foreground motion-reduce:animate-none" />
          <span className="size-1.5 animate-pulse rounded-full bg-muted-foreground [animation-delay:150ms] motion-reduce:animate-none" />
          <span className="size-1.5 animate-pulse rounded-full bg-muted-foreground [animation-delay:300ms] motion-reduce:animate-none" />
        </span>
        <span key={phrases[index]} className="animate-in fade-in duration-200">
          {phrases[index]}
        </span>
      </div>
      <div aria-hidden="true">{children}</div>
    </div>
  );
}
