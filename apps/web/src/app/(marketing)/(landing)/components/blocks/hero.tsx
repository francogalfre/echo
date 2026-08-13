import { buttonVariants } from "@echo/ui/components/button-variants";
import { Icons } from "@echo/ui/components/icons";
import Link from "next/link";

import { Reveal, RevealItem } from "../reveal";
import { DashboardMock } from "./dashboard-mock";
import { HeroBackdrop } from "./hero-backdrop";

export const Hero = (): React.ReactElement => {
  return (
    <section className="relative -mt-20 overflow-hidden pt-32">
      <HeroBackdrop />

      <div className="relative mx-auto max-w-6xl px-6 pt-16 pb-4 sm:pt-24">
        <Reveal onLoad className="max-w-4xl">
          <RevealItem>
            <h1 className="font-pixel text-[2.25rem] leading-[1.05] font-medium tracking-tight text-pretty sm:text-5xl lg:text-[3.75rem]">
              User feedback, already sorted
            </h1>
          </RevealItem>

          <RevealItem>
            <p className="mt-6 max-w-2xl text-base text-muted-foreground text-pretty sm:text-lg">
              Collect feedback from a drop-in widget, the REST API, or a hosted page. Every
              submission is sentiment-scored and tagged by source as it lands, and recurring
              summaries tell you which complaints are trending.
            </p>
          </RevealItem>

          <RevealItem>
            <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <Link
                href="/register"
                className={buttonVariants({
                  size: "lg",
                  className: "group h-11 rounded-full px-6 text-sm",
                })}
              >
                Get started free
              </Link>
              <Link
                href="/docs/getting-started"
                className="rounded-full px-4 py-2 flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Read the docs
                <Icons.arrowRight className="transition-transform duration-200 group-hover:translate-x-0.5 size-4 mt-0.6" />
              </Link>
            </div>
          </RevealItem>
        </Reveal>

        <Reveal onLoad delay={0.35} className="mt-16 sm:mt-20">
          <RevealItem>
            <div className="rounded-3xl bg-secondary/70 p-2">
              <DashboardMock />
            </div>
          </RevealItem>
        </Reveal>
      </div>
    </section>
  );
};
