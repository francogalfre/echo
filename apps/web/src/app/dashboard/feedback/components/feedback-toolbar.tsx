"use client";

import { Icons } from "@echo/ui/components/icons";
import { Input } from "@echo/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@echo/ui/components/select";
import { cn } from "@echo/ui/lib/utils";

export type SentimentFilter = "all" | "positive" | "neutral" | "negative";
export type SourceFilter = "all" | "api" | "form" | "widget";

const SENTIMENT_SEGMENTS: { value: SentimentFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "positive", label: "Positive" },
  { value: "neutral", label: "Neutral" },
  { value: "negative", label: "Negative" },
];

const SOURCE_OPTIONS: { value: SourceFilter; label: string }[] = [
  { value: "all", label: "All sources" },
  { value: "api", label: "API" },
  { value: "widget", label: "Widget" },
  { value: "form", label: "Form" },
];

type FeedbackToolbarProps = {
  counts: Record<SentimentFilter, number>;
  sentiment: SentimentFilter;
  onSentimentChange: (value: SentimentFilter) => void;
  source: SourceFilter;
  onSourceChange: (value: SourceFilter) => void;
  search: string;
  onSearchChange: (value: string) => void;
};

export function FeedbackToolbar({
  counts,
  sentiment,
  onSentimentChange,
  source,
  onSourceChange,
  search,
  onSearchChange,
}: FeedbackToolbarProps): React.ReactElement {
  const handleSourceChange = (value: SourceFilter | null): void => {
    if (value) onSourceChange(value);
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
        {SENTIMENT_SEGMENTS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            aria-pressed={sentiment === value}
            onClick={() => onSentimentChange(value)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              sentiment === value
                ? "bg-background text-foreground shadow-sm ring-1 ring-foreground/10"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {label}{" "}
            <span className="tabular-nums text-muted-foreground">{counts[value]}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Select value={source} onValueChange={handleSourceChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end" alignItemWithTrigger={false}>
            {SOURCE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="relative">
          <Icons.search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search feedback…"
            className="h-9 pl-9 sm:w-72"
          />
        </div>
      </div>
    </div>
  );
}
