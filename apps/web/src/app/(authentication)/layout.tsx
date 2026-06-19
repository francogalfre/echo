import imagotipo from "@echo/assets/imagotipo/accent.png";
import Image from "next/image";
import type { ReactNode } from "react";

const AmbientGlow = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 bg-[radial-gradient(ellipse_55%_60%_at_50%_-10%,oklch(0.567_0.202_282.7_/_0.16),transparent_70%)]"
    />
  );
};

const AuthenticationLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden px-4 py-12">
      <AmbientGlow />
      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Image src={imagotipo} alt="echo" priority className="h-7 w-auto" />
        </div>
        {children}
      </div>
    </main>
  );
};

export default AuthenticationLayout;
