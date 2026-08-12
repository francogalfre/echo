"use client";

import { cn } from "@echo/ui/lib/utils";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export type DocsTocSection = {
  id: string;
  label: string;
};

const ACTIVE_SPRING = { type: "spring", stiffness: 500, damping: 40 } as const;

function getScrollParent(node: HTMLElement | null): HTMLElement | null {
  let el = node?.parentElement ?? null;
  while (el) {
    const style = getComputedStyle(el);
    if (/auto|scroll/.test(style.overflowY) && el.scrollHeight > el.clientHeight) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}

type DocsTocProps = {
  sections: readonly DocsTocSection[];
  layoutId: string;
  className?: string;
  showMobileRow?: boolean;
};

export function DocsToc({
  sections,
  layoutId,
  className,
  showMobileRow = true,
}: DocsTocProps): React.ReactElement {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const elements = sections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;

        const topMost = visible.reduce((closest, entry) =>
          entry.boundingClientRect.top < closest.boundingClientRect.top ? entry : closest,
        );

        setActiveId(topMost.target.id);
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 },
    );

    for (const element of elements) {
      observerRef.current.observe(element);
    }

    const lastId = sections[sections.length - 1]?.id;
    const scrollParent = getScrollParent(elements[0] ?? null);

    const checkAtBottom = (): void => {
      if (!lastId) return;

      const atBottom = scrollParent
        ? scrollParent.scrollTop + scrollParent.clientHeight >=
          scrollParent.scrollHeight - 2
        : globalThis.scrollY + globalThis.innerHeight >=
          document.documentElement.scrollHeight - 2;

      if (atBottom) {
        setActiveId(lastId);
      }
    };

    scrollParent?.addEventListener("scroll", checkAtBottom, { passive: true });
    if (!scrollParent) {
      globalThis.addEventListener("scroll", checkAtBottom, { passive: true });
    }
    checkAtBottom();

    return () => {
      observerRef.current?.disconnect();
      scrollParent?.removeEventListener("scroll", checkAtBottom);
      if (!scrollParent) {
        globalThis.removeEventListener("scroll", checkAtBottom);
      }
    };
  }, [sections]);

  const scrollToSection = (id: string): void => {
    const element = document.getElementById(id);
    if (!element) return;

    const reduceMotion = globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;
    element.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    setActiveId(id);
    globalThis.history.replaceState(null, "", `#${id}`);
  };

  return (
    <nav aria-label="On this page" className={cn("docs-toc-nav", className)}>
      <div
        className={cn(
          "hidden gap-1 overflow-x-auto pb-2",
          showMobileRow && "docs-toc-chips",
        )}
      >
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => scrollToSection(section.id)}
            className={cn(
              "shrink-0 rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors",
              activeId === section.id
                ? "bg-accent/10 text-accent"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
            )}
          >
            {section.label}
          </button>
        ))}
      </div>

      <div className="hidden docs-toc-rail">
        <p className="micro-label mb-3 px-3">On this page</p>
        <ul className="space-y-1">
          {sections.map((section) => {
            const isActive = activeId === section.id;

            return (
              <li key={section.id}>
                <button
                  type="button"
                  onClick={() => scrollToSection(section.id)}
                  className={cn(
                    "relative block w-full rounded-lg px-3 py-1.5 text-left text-sm",
                    "transition-colors duration-150",
                    isActive
                      ? "font-medium text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId={layoutId}
                      transition={ACTIVE_SPRING}
                      className="absolute inset-0 rounded-lg bg-muted"
                    />
                  )}
                  <span className="relative">{section.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
