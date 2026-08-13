import { buttonVariants } from "@echo/ui/components/button-variants";
import { Icons } from "@echo/ui/components/icons";
import Link from "next/link";

import { Reveal, RevealItem } from "../reveal";
import { Section, SectionHeading } from "../section";

const channels = [
  {
    title: "Drop-in widget",
    description:
      "A floating button on your site. Users rate and comment without leaving the page.",
    icon: "star",
  },
  {
    title: "REST API",
    description:
      "Send feedback from your backend with a secret key, and read it back into your own tools.",
    icon: "externalLink",
  },
  {
    title: "Hosted page",
    description:
      "A branded page on your project slug for support replies and beta invites. Nothing to deploy.",
    icon: "message",
  },
] as const;

const WidgetCard = (): React.ReactElement => (
  <div className="absolute top-0 left-0 w-[15rem] rounded-xl border border-border bg-card p-4 shadow-md">
    <p className="text-[11px] text-muted-foreground">Widget</p>
    <p className="mt-1.5 text-sm font-medium">How was it?</p>
    <div className="mt-2.5 flex gap-1 text-accent">
      {Array.from({ length: 5 }, (_, index) => (
        <Icons.star key={index} className="size-3.5" />
      ))}
    </div>
    <div className="mt-3 h-6 rounded-md bg-secondary" />
  </div>
);

const ApiCard = (): React.ReactElement => (
  <div className="absolute top-28 right-0 z-10 w-[14rem] rounded-xl border border-border bg-card p-4 shadow-md">
    <p className="text-[11px] text-muted-foreground">REST API</p>
    <p className="mt-1.5 font-mono text-xs">
      <span className="text-accent">POST</span> /api/feedback
    </p>
    <div className="mt-3 flex items-center gap-1.5">
      <span className="rounded-md bg-pastel-green-bg px-2 py-0.5 font-mono text-[10px] text-pastel-green-text">
        201
      </span>
      <span className="text-[10px] text-muted-foreground">created</span>
    </div>
  </div>
);

const HostedCard = (): React.ReactElement => (
  <div className="absolute bottom-4 left-8 w-[15rem] rounded-xl border border-border bg-card p-4 shadow-md">
    <p className="text-[11px] text-muted-foreground">Hosted page</p>
    <p className="mt-1.5 text-sm font-medium">Tell us what to fix</p>
    <div className="mt-2.5 space-y-1.5">
      <div className="h-1.5 w-full rounded-full bg-secondary" />
      <div className="h-1.5 w-3/5 rounded-full bg-secondary" />
    </div>
  </div>
);

export const Channels = (): React.ReactElement => {
  return (
    <Section id="channels">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <RevealItem>
            <SectionHeading
              title="Three ways in. One inbox."
              description="Pick whichever surface fits. However it arrives, it lands in the same place, already classified."
            />
          </RevealItem>

          <RevealItem>
            <ul className="mt-9 space-y-5">
              {channels.map((channel) => {
                const Icon = Icons[channel.icon];

                return (
                  <li key={channel.title} className="flex gap-3.5">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                      <Icon className="size-4" />
                    </span>
                    <div>
                      <p className="text-sm font-medium">{channel.title}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {channel.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </RevealItem>

          <RevealItem>
            <Link
              href="/docs/getting-started"
              className={buttonVariants({
                size: "lg",
                className: "group mt-9 h-11 rounded-full px-6 text-sm",
              })}
            >
              See how to connect
              <Icons.arrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </RevealItem>
        </Reveal>

        <Reveal delay={0.15}>
          <RevealItem>
            <div className="rounded-2xl bg-secondary/50 p-6 sm:p-8">
              <div className="relative mx-auto h-[24rem] w-full max-w-md">
                <WidgetCard />
                <ApiCard />
                <HostedCard />
              </div>
            </div>
          </RevealItem>
        </Reveal>
      </div>
    </Section>
  );
};
