"use client";

import { Icons } from "@echo/ui/components/icons";
import { usePathname } from "next/navigation";

import { authClient } from "@/lib/auth-client";

const SEGMENT_LABELS: Record<string, string> = {
  feedback: "Feedback",
  collect: "Collect",
  "feedback-page": "Feedback page",
  api: "API",
  widget: "Widget",
  team: "Team",
  members: "Members",
  projects: "Projects",
  settings: "Settings",
};

function toLabel(segment: string): string {
  return SEGMENT_LABELS[segment] ?? "Detail";
}

function crumbsFromPath(pathname: string): string[] {
  const segments = pathname.split("/").filter(Boolean).slice(1);

  if (segments.length === 0) return ["Overview"];

  return segments.map(toLabel);
}

export const Breadcrumb = (): React.ReactElement => {
  const pathname = usePathname();
  const { data: activeOrg } = authClient.useActiveOrganization();

  const crumbs = crumbsFromPath(pathname);
  const project = activeOrg?.name ?? "Project";

  return (
    <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-sm">
      <span className="truncate font-medium text-foreground">{project}</span>
      {crumbs.map((crumb, index) => (
        <span key={crumb} className="flex min-w-0 items-center gap-1.5">
          <Icons.chevronRight className="size-3 shrink-0 text-muted-foreground/50" />
          <span
            className={
              index === crumbs.length - 1
                ? "truncate text-foreground"
                : "truncate text-muted-foreground"
            }
          >
            {crumb}
          </span>
        </span>
      ))}
    </nav>
  );
};
