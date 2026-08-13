import type { ReactNode } from "react";

import { MotionProvider } from "../../dashboard/components/layout/motion-provider";
import { LandingFooter } from "./components/landing-footer";
import { LandingNav } from "./components/landing-nav";
import { SmoothScroll } from "./components/smooth-scroll";

type LandingLayoutProps = { children: ReactNode };

const LandingLayout = ({ children }: LandingLayoutProps) => {
  return (
    <MotionProvider>
      <SmoothScroll />
      <div className="flex min-h-svh flex-col bg-background p-2 pb-0 rounded-lg">
        <LandingNav />
        <main className="flex-1 ">{children}</main>
        <LandingFooter />
      </div>
    </MotionProvider>
  );
};

export default LandingLayout;
