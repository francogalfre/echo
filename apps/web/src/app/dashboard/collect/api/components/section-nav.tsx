"use client";

import { cn } from "@echo/ui/lib/utils";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export type NavSection = {
  id: string;
  label: string;
};

const activeSpring = { type: "spring", stiffness: 500, damping: 40 } as const;

type SectionNavProps = {
  sections: readonly NavSection[];
  className?: string;
};

export const SectionNav = ({
  sections,
  className,
}: SectionNavProps): React.ReactElement => {
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

    return () => observerRef.current?.disconnect();
  }, [sections]);

  const scrollToSection = (id: string): void => {
    const element = document.getElementById(id);
    if (!element) return;

    setActiveId(id);
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className={cn("lg:sticky lg:top-24 lg:self-start", className)}>
      <p className="mb-3 px-3 text-[11px] font-semibold text-muted-foreground">
        On this page
      </p>
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
                    layoutId="api-section-nav-active"
                    transition={activeSpring}
                    className="absolute inset-0 rounded-lg bg-muted"
                  />
                )}
                <span className="relative">{section.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
