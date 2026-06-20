"use client";

import { IconChevronDown } from "@tabler/icons-react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import type { NavItem } from "./types";

type NavLinkProps = { item: NavItem; active: boolean };

export const NavLink = ({
  item: { label, href, icon: Icon },
  active,
}: NavLinkProps): React.ReactElement => (
  <Link
    href={href as Route}
    className={[
      "group flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors duration-300",
      active
        ? "bg-foreground/5 text-foreground"
        : "text-muted-foreground hover:text-foreground",
    ].join(" ")}
  >
    <Icon
      className={[
        "size-4.5 shrink-0 transition-colors duration-300",
        active ? "text-foreground" : "text-muted-foreground group-hover:text-foreground",
      ].join(" ")}
    />
    {label}
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
    ({ href }) => pathname === href || pathname.startsWith(href + "/"),
  );
  const [open, setOpen] = useState(isChildActive);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={[
          "group flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors duration-300",
          isChildActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
        ].join(" ")}
      >
        <Icon
          className={[
            "size-4.5 shrink-0 transition-colors duration-300",
            isChildActive
              ? "text-foreground"
              : "text-muted-foreground group-hover:text-foreground",
          ].join(" ")}
        />
        {label}
        <IconChevronDown
          className={[
            "ml-auto size-3.5 shrink-0 text-muted-foreground transition-transform duration-200",
            open ? "rotate-180" : "",
          ].join(" ")}
        />
      </button>
      {open ? (
        <div className="ml-4 mt-0.5 flex flex-col gap-0.5 border-l border-border pl-2.5">
          {subLinks.map(({ label: subLabel, href }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href as Route}
                className={[
                  "rounded-md px-2 py-1.5 text-sm transition-colors duration-300",
                  isActive
                    ? "font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                ].join(" ")}
              >
                {subLabel}
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};
