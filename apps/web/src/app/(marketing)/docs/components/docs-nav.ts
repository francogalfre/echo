import type { Icons } from "@echo/ui/components/icons";

export type DocsLink = {
  href: string;
  label: string;
  icon: keyof typeof Icons;
};

export type DocsGroup = {
  label: string;
  links: readonly DocsLink[];
};

export const DOCS_GROUPS: readonly DocsGroup[] = [
  {
    label: "Overview",
    links: [{ href: "/docs", label: "Introduction", icon: "book" }],
  },
  {
    label: "Setup",
    links: [
      { href: "/docs/getting-started", label: "Getting started", icon: "circlePlus" },
    ],
  },
  {
    label: "Reference",
    links: [
      { href: "/docs/api", label: "REST API", icon: "externalLink" },
      { href: "/docs/widget", label: "Widget", icon: "star" },
    ],
  },
];

export const DOCS_LINKS: readonly DocsLink[] = DOCS_GROUPS.flatMap((group) => group.links);
