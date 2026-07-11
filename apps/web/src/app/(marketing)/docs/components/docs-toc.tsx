"use client";

import { cn } from "@echo/ui/lib/utils";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type TocHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

const readHeadings = (): TocHeading[] => {
  const container = document.getElementById("docs-content");
  if (!container) return [];

  const elements = container.querySelectorAll<HTMLHeadingElement>("h2[id], h3[id]");

  return [...elements].map((element) => ({
    id: element.id,
    text: element.textContent ?? "",
    level: element.tagName === "H2" ? 2 : 3,
  }));
};

export const DocsToc = (): React.ReactElement | null => {
  const pathname = usePathname();
  const [headings, setHeadings] = useState<TocHeading[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const next = readHeadings();
    setHeadings(next);
    setActiveId(next[0]?.id ?? null);
  }, [pathname]);

  useEffect(() => {
    if (headings.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 },
    );

    for (const heading of headings) {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    }

    return () => observer.disconnect();
  }, [headings]);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      event.preventDefault();
      const target = document.getElementById(id);
      if (!target) return;

      const reduceMotion = globalThis.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      setActiveId(id);
      globalThis.history.replaceState(null, "", `#${id}`);
    },
    [],
  );

  if (headings.length === 0) return null;

  return (
    <nav
      aria-label="On this page"
      className="hidden xl:sticky xl:top-6 xl:block xl:w-56 xl:shrink-0"
    >
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        On this page
      </p>
      <ul className="mt-3 space-y-0.5 border-l border-border">
        {headings.map((heading) => {
          const isActive = heading.id === activeId;

          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                aria-current={isActive ? "location" : undefined}
                onClick={(event) => handleClick(event, heading.id)}
                className={cn(
                  "-ml-px block border-l-2 py-1 pr-2 text-sm transition-colors duration-150",
                  heading.level === 3 ? "pl-7" : "pl-4",
                  isActive
                    ? "border-accent font-medium text-accent"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
