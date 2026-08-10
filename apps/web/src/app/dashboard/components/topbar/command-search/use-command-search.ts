"use client";

import { Icons } from "@echo/ui/components/icons";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useRole } from "../../../hooks/use-role";

export type IconComponent = (typeof Icons)[keyof typeof Icons];

export type CommandItem = {
  id: string;
  title: string;
  section: string;
  icon: IconComponent;
  shortcut?: string;
  adminOnly?: boolean;
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
    adminOnly: true,
    run: navigate("/dashboard/collect/feedback-page"),
  },
  {
    id: "api",
    title: "API keys",
    section: "Collect",
    icon: Icons.lock,
    adminOnly: true,
    run: navigate("/dashboard/collect/api"),
  },
  {
    id: "widget",
    title: "Widget",
    section: "Collect",
    icon: Icons.sparkles,
    adminOnly: true,
    run: navigate("/dashboard/collect/widget"),
  },
  {
    id: "team-members",
    title: "Team members",
    section: "Team",
    icon: Icons.user,
    adminOnly: true,
    run: navigate("/dashboard/settings/team"),
  },
  {
    id: "projects",
    title: "Projects",
    section: "Team",
    icon: Icons.circlePlus,
    adminOnly: true,
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

export function useCommandSearch(): {
  open: boolean;
  setOpen: (open: boolean) => void;
  query: string;
  setQuery: (query: string) => void;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  results: CommandItem[];
  sections: [string, CommandItem[]][];
  close: () => void;
  select: (item: CommandItem) => void;
  onPanelKeyDown: (event: React.KeyboardEvent) => void;
} {
  const router = useRouter();
  const { isAdmin } = useRole();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    const available = COMMANDS.filter((item) => !item.adminOnly || isAdmin);

    if (!term) return available;

    return available.filter((item) => item.title.toLowerCase().includes(term));
  }, [query, isAdmin]);

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

  const onPanelKeyDown = useCallback(
    (event: React.KeyboardEvent): void => {
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
    },
    [results, activeIndex, select],
  );

  return {
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
  };
}
