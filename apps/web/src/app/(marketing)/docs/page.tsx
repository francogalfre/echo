import { Icons } from "@echo/ui/components/icons";
import { HoverLift } from "@echo/ui/components/motion/hover-lift";
import { Separator } from "@echo/ui/components/separator";
import type { Route } from "next";
import Link from "next/link";

import { createMetadata } from "@/utils/metadata";

import { DocsPageHeader } from "./components/docs-page-header";

export const metadata = createMetadata({
  title: "Documentation",
  description: "Guides for getting started, the REST API, and the feedback widget.",
  path: "/docs",
});

type DocCard = {
  href: string;
  title: string;
  description: string;
  icon: keyof typeof Icons;
};

const CARDS: readonly DocCard[] = [
  {
    href: "/docs/getting-started",
    title: "Getting started",
    description: "Create a project, generate API keys, and send your first feedback.",
    icon: "circlePlus",
  },
  {
    href: "/docs/api",
    title: "REST API",
    description: "Authenticate and call the public feedback endpoints from your backend.",
    icon: "externalLink",
  },
  {
    href: "/docs/widget",
    title: "Widget",
    description: "Drop a floating, sentiment-first feedback button into your app.",
    icon: "star",
  },
];

const DocsIntroductionPage = () => {
  return (
    <div className="space-y-12">
      <DocsPageHeader
        title="Introduction"
        description="Echo is developer-first feedback infrastructure. It gives you API keys, a REST endpoint, and a drop-in widget so you can collect feedback from your users without building any of the plumbing yourself."
        breadcrumb={["Introduction"]}
      />

      <Separator />

      <div>
        <h2 id="how-echo-is-organized" className="text-lg font-semibold tracking-tight">
          How Echo is organized
        </h2>
        <p className="mt-2 text-muted-foreground">
          Every account is built from three nested layers:
        </p>
        <ul className="mt-3 space-y-2 text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">Organizations</span> — your team
            or company. Billing and plan live here.
          </li>
          <li>
            <span className="font-medium text-foreground">Projects</span> — one app or
            product you collect feedback for. Each project has its own API keys.
          </li>
          <li>
            <span className="font-medium text-foreground">Feedback</span> — the individual
            submissions your users send in, tagged with a source of{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">api</code>,{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">form</code>, or{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">widget</code>.
          </li>
        </ul>
      </div>

      <Separator />

      <div>
        <h2 id="explore-the-docs" className="text-lg font-semibold tracking-tight">
          Explore the docs
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {CARDS.map((card) => {
            const Icon = Icons[card.icon];

            return (
              <HoverLift key={card.href} className="rounded-xl border border-border">
                <Link href={card.href as Route} className="flex h-full flex-col gap-3 p-5">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Icon className="size-5" />
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {card.title}
                  </span>
                  <span className="text-sm text-muted-foreground">{card.description}</span>
                </Link>
              </HoverLift>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DocsIntroductionPage;
