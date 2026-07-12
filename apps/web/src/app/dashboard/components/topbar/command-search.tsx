"use client";

import { Icons } from "@echo/ui/components/icons";
import { Kbd } from "@echo/ui/components/kbd";
import { cn } from "@echo/ui/lib/utils";
import { durations, easings } from "@echo/ui/lib/motion";
import { AnimatePresence, motion } from "motion/react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type IconComponent = (typeof Icons)[keyof typeof Icons];

type CommandItem = {
  id: string;
  title: string;
  section: string;
  icon: IconComponent;
  shortcut?: string;
  run: (router: ReturnType<typeof useRouter>) => void;
};

function navigate(href: string): (router: ReturnType<typeof useRouter>) => void {
  return (router) => router.push(href as Route);
}

function openExternal(href: string): () => void {
  return () => globalThis.open(href, "_blank", "noopener,noreferrer");
}

function isTypingElement(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable
  );
}

const COMMANDS: CommandItem[] = [
  {
    id: "overview",
    title: "Overview",
    section: "Navigation",
    icon: Icons.home,
    run: navigate("/dashboard"),
  },
  {
    id: "feedback",
    title: "Feedback",
    section: "Navigation",
    icon: Icons.message,
    run: navigate("/dashboard/feedback"),
  },
  {
    id: "board",
    title: "Board",
    section: "Navigation",
    icon: Icons.board,
    run: navigate("/dashboard/board"),
  },
  {
    id: "feedback-page",
    title: "Feedback page",
    section: "Collect",
    icon: Icons.radar,
    run: navigate("/dashboard/collect/feedback-page"),
  },
  {
    id: "api",
    title: "API keys",
    section: "Collect",
    icon: Icons.lock,
    run: navigate("/dashboard/collect/api"),
  },
  {
    id: "widget",
    title: "Widget",
    section: "Collect",
    icon: Icons.sparkles,
    run: navigate("/dashboard/collect/widget"),
  },
  {
    id: "team-members",
    title: "Team members",
    section: "Team",
    icon: Icons.user,
    run: navigate("/dashboard/settings/team"),
  },
  {
    id: "projects",
    title: "Projects",
    section: "Team",
    icon: Icons.circlePlus,
    run: navigate("/dashboard/settings/team"),
  },
  {
    id: "settings",
    title: "Settings",
    section: "Settings",
    icon: Icons.slidersHorizontal,
    shortcut: "⌘ ,",
    run: navigate("/dashboard/settings"),
  },
  {
    id: "docs",
    title: "Documentation",
    section: "Help",
    icon: Icons.book,
    run: navigate("/docs"),
  },
  {
    id: "support",
    title: "Contact support",
    section: "Help",
    icon: Icons.help,
    run: openExternal("mailto:francogalfre.code@gmail.com"),
  },
];

export const CommandSearch = (): React.ReactElement => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return COMMANDS;

    return COMMANDS.filter((item) => item.title.toLowerCase().includes(term));
  }, [query]);

  const sections = useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    for (const item of results) {
      const list = map.get(item.section) ?? [];
      list.push(item);
      map.set(item.section, list);
    }
    return [...map.entries()];
  }, [results]);

  const close = useCallback((): void => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  }, []);

  const select = useCallback(
    (item: CommandItem): void => {
      close();
      item.run(router);
    },
    [close, router],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "k") return;
      if (isTypingElement(event.target) && event.target !== inputRef.current) return;
      event.preventDefault();
      setOpen((value) => !value);
    };
    globalThis.addEventListener("keydown", onKeyDown);
    return () => globalThis.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onEscape = (event: KeyboardEvent): void => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      close();
    };
    globalThis.addEventListener("keydown", onEscape);
    return () => globalThis.removeEventListener("keydown", onEscape);
  }, [open, close]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const onPanelKeyDown = (event: React.KeyboardEvent): void => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const item = results[activeIndex];
      if (item) select(item);
    }
  };

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
                {results.length === 0 ? (
                  <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                    No results found.
                  </p>
                ) : (
                  sections.map(([section, items]) => (
                    <div key={section} className="mb-1">
                      <p className="px-3 py-1.5 text-xs font-medium text-muted-foreground">
                        {section}
                      </p>
                      {items.map((item) => {
                        const index = results.indexOf(item);
                        const isActive = index === activeIndex;
                        const ItemIcon = item.icon;
                        return (
                          <button
                            type="button"
                            key={item.id}
                            onMouseEnter={() => setActiveIndex(index)}
                            onClick={() => select(item)}
                            className={cn(
                              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                              isActive
                                ? "bg-foreground/5 text-foreground"
                                : "text-muted-foreground",
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
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
