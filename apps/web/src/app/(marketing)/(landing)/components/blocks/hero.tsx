import { buttonVariants } from "@echo/ui/components/button-variants";
import { Icons } from "@echo/ui/components/icons";
import Link from "next/link";

import { Reveal, RevealItem } from "../reveal";
import { DashboardMock } from "./dashboard-mock";
import { HeroBackdrop } from "./hero-backdrop";

export const Hero = (): React.ReactElement => {
  return (
    <section className="relative -mt-20 overflow-hidden pt-20">
      <HeroBackdrop />

      <div className="relative mx-auto max-w-6xl px-6 pt-16 pb-4 sm:pt-24">
        <Reveal onLoad className="mx-auto max-w-3xl text-center">
          <RevealItem>
            <h1 className="font-pixel text-[2.25rem] leading-[1.05] font-medium text-balance sm:text-6xl lg:text-[4.25rem]">
              User feedback, already sorted
            </h1>
          </RevealItem>

          <RevealItem>
            <p className="mx-auto mt-7 max-w-xl text-base text-muted-foreground text-pretty sm:text-lg">
              Collect it from a drop-in widget, a REST API or a hosted page. Echo scores
              sentiment the moment it lands and tells your team what actually matters.
            </p>
          </RevealItem>

          <RevealItem>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/register"
                className={buttonVariants({
                  size: "lg",
                  className: "group h-11 rounded-full px-6 text-sm",
                })}
              >
                Start collecting free
                <Icons.arrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/docs/getting-started"
                className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Read the docs
              </Link>
            </div>
          </RevealItem>

          <RevealItem>
            <p className="mt-6 text-xs text-muted-foreground">
              Free forever plan · No credit card required
            </p>
          </RevealItem>
        </Reveal>

        <Reveal onLoad delay={0.35} className="mt-16 sm:mt-20">
          <RevealItem>
            <DashboardMock />
          </RevealItem>
        </Reveal>
      </div>
    </section>
  );
};
