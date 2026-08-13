import { buttonVariants } from "@echo/ui/components/button-variants";
import { Icons } from "@echo/ui/components/icons";
import { cn } from "@echo/ui/lib/utils";
import Image from "next/image";

import { MotionButtonLink } from "../motion-button-link";
import { Reveal, RevealItem } from "../reveal";
import { Section, SectionHeading } from "../section";

const channels = [
  {
    title: "Custom page",
    description:
      "A branded page on your project slug for support replies and beta invites. Nothing to deploy.",
    icon: "message",
  },
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
] as const;

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
            <ul className="mt-9 space-y-8">
              {channels.map((channel) => {
                const Icon = Icons[channel.icon];

                return (
                  <li key={channel.title} className="flex gap-4">
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
            <MotionButtonLink
              href="/docs/getting-started"
              className={cn(
                buttonVariants({ size: "lg" }),
                "group mt-9 h-11 rounded-full px-6 text-sm hover:shadow-none",
              )}
            >
              See how to connect
              <Icons.arrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </MotionButtonLink>
          </RevealItem>
        </Reveal>

        <Reveal delay={0.15}>
          <RevealItem>
            <Image
              src="/landing/channels.webp"
              alt="The hosted Echo feedback page, with a comment form beside a list of recent feedback"
              width={1040}
              height={896}
              className="h-auto w-full rounded-2xl"
            />
          </RevealItem>
        </Reveal>
      </div>
    </Section>
  );
};
