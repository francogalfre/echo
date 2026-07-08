import { Separator } from "@echo/ui/components/separator";
import type { Metadata, Route } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Documentation · echo",
};

type DocCard = {
  href: string;
  title: string;
  description: string;
};

const CARDS: readonly DocCard[] = [
  {
    href: "/docs/getting-started",
    title: "Getting started",
    description: "Create a project, generate API keys, and send your first feedback.",
  },
  {
    href: "/docs/api",
    title: "REST API",
    description: "Authenticate and call the public feedback endpoints from your backend.",
  },
  {
    href: "/docs/widget",
    title: "Widget",
    description: "Drop a floating, sentiment-first feedback button into your app.",
  },
];

const DocsIntroductionPage = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Introduction</h1>
        <p className="mt-3 text-muted-foreground">
          Echo is developer-first feedback infrastructure. It gives you API keys, a REST
          endpoint, and a drop-in widget so you can collect feedback from your users without
          building any of the plumbing yourself.
        </p>
      </div>

      <Separator />

      <div>
        <h2 className="text-lg font-semibold tracking-tight">How Echo is organized</h2>
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

      <div className="grid gap-4 sm:grid-cols-3">
        {CARDS.map((card) => (
          <Link
            key={card.href}
            href={card.href as Route}
            className="rounded-xl border border-border p-4 transition-colors hover:bg-muted/40"
          >
            <h3 className="text-sm font-semibold">{card.title}</h3>
            <p className="mt-1.5 text-xs text-muted-foreground">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DocsIntroductionPage;
