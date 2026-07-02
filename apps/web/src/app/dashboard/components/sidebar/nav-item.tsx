"use client";

import { Icons } from "@echo/ui/components/icons";
import { cn } from "@echo/ui/lib/utils";
import { motion } from "motion/react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import type { NavItem } from "./types";

type NavLinkProps = { item: NavItem; active: boolean };

const activeSpring = { type: "spring", stiffness: 500, damping: 40 } as const;

export const NavLink = ({
  item: { label, href, icon: Icon },
  active,
}: NavLinkProps): React.ReactElement => (
  <Link
    href={href as Route}
    aria-current={active ? "page" : undefined}
    className={cn(
      "group relative flex items-center gap-2.5 rounded-lg px-2.5 py-1.75 text-sm",
      "transition-colors duration-150",
      active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
    )}
  >
    {active ? (
      <motion.span
        layoutId="sidebar-active"
        transition={activeSpring}
        className="absolute inset-0 rounded-lg bg-foreground/5"
      />
    ) : null}
    <Icon
      className={cn(
        "relative size-4.5 shrink-0 transition-colors duration-150",
        active ? "text-foreground" : "text-muted-foreground group-hover:text-foreground",
      )}
    />
    <span className="relative">{label}</span>
  </Link>
);

type SubLink = { label: string; href: string };
type ExpandableNavLinkProps = { item: NavItem; subLinks: SubLink[] };

export const ExpandableNavLink = ({
  item: { label, icon: Icon },
  subLinks,
}: ExpandableNavLinkProps): React.ReactElement => {
  const pathname = usePathname();
  const isChildActive = subLinks.some(
    ({ href }) => pathname === href || pathname.startsWith(`${href}/`),
  );
  const [open, setOpen] = useState(isChildActive);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className={cn(
          "group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.75 text-sm",
          "transition-colors duration-150",
          isChildActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
        )}
      >
        <Icon
          className={cn(
            "size-4.5 shrink-0 transition-colors duration-150",
            isChildActive
              ? "text-foreground"
              : "text-muted-foreground group-hover:text-foreground",
          )}
        />
        {label}
        <motion.span
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ duration: 0.15 }}
          className="ml-auto"
        >
          <Icons.chevronRight className="size-3.5 text-muted-foreground/70" />
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden"
      >
        <div className="ml-4.75 flex flex-col gap-0.5 border-l border-border py-0.5 pl-2.5">
          {subLinks.map(({ label: subLabel, href }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href as Route}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative rounded-md px-2.5 py-1.5 text-[13px] transition-colors duration-150",
                  isActive
                    ? "text-foreground before:absolute before:-left-[11.5px] before:top-1/2 before:h-4 before:w-px before:-translate-y-1/2 before:bg-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {subLabel}
              </Link>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
