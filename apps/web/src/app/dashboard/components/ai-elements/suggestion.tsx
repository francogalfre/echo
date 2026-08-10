"use client";

import { cn } from "@echo/ui/lib/utils";
import * as React from "react";

type SuggestionsProps = {
  children: React.ReactNode;
  className?: string;
};

export function Suggestions({ children, className }: SuggestionsProps): React.ReactElement {
  return <div className={cn("flex flex-wrap gap-2", className)}>{children}</div>;
}

type SuggestionProps = {
  suggestion: string;
  onClick: (suggestion: string) => void;
  children?: React.ReactNode;
  disabled?: boolean;
  className?: string;
};

export function Suggestion({
  suggestion,
  onClick,
  children,
  disabled = false,
  className,
}: SuggestionProps): React.ReactElement {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onClick(suggestion)}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border/80",
        "bg-background px-3 py-1.5 text-xs font-medium text-foreground",
        "transition-all duration-200",
        "hover:border-accent/30 hover:bg-accent/5 hover:text-accent",
        "active:scale-[0.97]",
        "disabled:pointer-events-none disabled:opacity-50",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      {children}
      <span>{suggestion}</span>
    </button>
  );
}
