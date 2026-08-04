"use client";

import { Icons } from "@echo/ui/components/icons";
import { Kbd } from "@echo/ui/components/kbd";
import { durations, easings } from "@echo/ui/lib/motion";
import { AnimatePresence, motion } from "motion/react";

import { SearchResults } from "./search-results";
import { useCommandSearch } from "./use-command-search";

export const CommandSearch = (): React.ReactElement => {
  const {
    open,
    setOpen,
    query,
    setQuery,
    activeIndex,
    setActiveIndex,
    inputRef,
    results,
    sections,
    close,
    select,
    onPanelKeyDown,
  } = useCommandSearch();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-8 w-44 items-center gap-2 rounded-lg border border-border bg-background px-2.5 text-[13px] text-muted-foreground transition-colors hover:border-foreground/20 sm:w-60"
      >
        <Icons.search className="size-3.5 shrink-0" />
        <span className="flex-1 text-left">Search…</span>
        <Kbd>⌘K</Kbd>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: durations.fast }}
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-[12vh] backdrop-blur-sm"
            onClick={close}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -8 }}
              transition={{ duration: durations.base, ease: easings.out }}
              className="w-full max-w-xl overflow-hidden rounded-xl border border-border bg-card shadow-md"
              onClick={(event) => event.stopPropagation()}
              onKeyDown={onPanelKeyDown}
            >
              <div className="flex items-center gap-2.5 border-b border-border px-4">
                <Icons.search className="size-4 shrink-0 text-muted-foreground" />
                <input
                  ref={inputRef}
                  autoFocus
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search pages, settings, help…"
                  className="h-12 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
                <Kbd>ESC</Kbd>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-2">
                <SearchResults
                  results={results}
                  sections={sections}
                  activeIndex={activeIndex}
                  onHoverIndex={setActiveIndex}
                  onSelect={select}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
