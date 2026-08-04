"use client";

import { Kbd } from "@echo/ui/components/kbd";
import { cn } from "@echo/ui/lib/utils";

import type { CommandItem } from "./use-command-search";

type SearchResultsProps = {
  readonly results: CommandItem[];
  readonly sections: [string, CommandItem[]][];
  readonly activeIndex: number;
  readonly onHoverIndex: (index: number) => void;
  readonly onSelect: (item: CommandItem) => void;
};

export function SearchResults({
  results,
  sections,
  activeIndex,
  onHoverIndex,
  onSelect,
}: SearchResultsProps): React.ReactElement {
  if (results.length === 0) {
    return (
      <p className="px-3 py-8 text-center text-sm text-muted-foreground">
        No results found.
      </p>
    );
  }

  return (
    <>
      {sections.map(([section, items]) => (
        <div key={section} className="mb-1">
          <p className="px-3 py-1.5 text-xs font-medium text-muted-foreground">{section}</p>
          {items.map((item) => {
            const index = results.indexOf(item);
            const isActive = index === activeIndex;
            const ItemIcon = item.icon;
            return (
              <button
                type="button"
                key={item.id}
                onMouseEnter={() => onHoverIndex(index)}
                onClick={() => onSelect(item)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                  isActive ? "bg-foreground/5 text-foreground" : "text-muted-foreground",
                )}
              >
                <ItemIcon className="size-4 shrink-0" />
                <span className="flex-1 text-foreground">{item.title}</span>
                {item.shortcut && (
                  <Kbd className="bg-transparent border-0">{item.shortcut}</Kbd>
                )}
              </button>
            );
          })}
        </div>
      ))}
    </>
  );
}
