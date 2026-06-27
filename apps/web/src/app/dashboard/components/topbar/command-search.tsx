"use client";

import { Icons } from "@echo/ui/components/icons";
import { cn } from "@echo/ui/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

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
    id: "feedback-page",
    title: "Feedback page",
    section: "Navigation",
    icon: Icons.radar,
    run: navigate("/dashboard/collect/feedback-page"),
  },
  {
    id: "api",
    title: "API keys",
    section: "Navigation",
    icon: Icons.radar,
    run: navigate("/dashboard/collect/api"),
  },
  {
    id: "widget",
    title: "Widget",
    section: "Navigation",
    icon: Icons.radar,
    run: navigate("/dashboard/collect/widget"),
  },
  {
    id: "settings",
    title: "Settings",
    section: "Settings",
    icon: Icons.settings,
    shortcut: "⌘ ,",
    run: navigate("/dashboard/settings"),
  },
  {
    id: "docs",
    title: "Documentation",
    section: "Help",
    icon: Icons.book,
    run: openExternal("https://docs.echo.dev"),
  },
  {
    id: "support",
    title: "Contact support",
    section: "Help",
    icon: Icons.help,
    run: openExternal("mailto:support@echo.dev"),
  },
];

export const CommandSearch = (): React.ReactElement => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

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
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    globalThis.addEventListener("keydown", onKeyDown);
    return () => globalThis.removeEventListener("keydown", onKeyDown);
  }, []);

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
    } else if (event.key === "Escape") {
      event.preventDefault();
      close();
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-9 w-44 items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm text-muted-foreground transition-colors hover:bg-foreground/5 sm:w-64"
      >
        <Icons.search className="size-4 shrink-0" />
        <span className="flex-1 text-left">Search…</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-[12vh] backdrop-blur-sm"
            onClick={close}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -8 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-xl overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
              onClick={(event) => event.stopPropagation()}
              onKeyDown={onPanelKeyDown}
            >
              <div className="flex items-center gap-2.5 border-b border-border px-4">
                <Icons.search className="size-4 shrink-0 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search pages, settings, help…"
                  className="h-12 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
                <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                  ESC
                </kbd>
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
                              <kbd className="text-xs tracking-widest text-muted-foreground">
                                {item.shortcut}
                              </kbd>
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
