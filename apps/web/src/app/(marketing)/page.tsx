import { buttonVariants } from "@echo/ui/components/button-variants";
import Link from "next/link";

import { createMetadata } from "@/lib/metadata";

import { Logo } from "./components/logo";

export const metadata = createMetadata({ path: "/" });

const Home = () => {
  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center gap-6 px-4 text-center">
      <Logo />
      <p className="max-w-sm text-sm text-muted-foreground">
        Feedback infrastructure for developers.
      </p>
      <div className="flex items-center gap-2">
        <Link href="/login" className={buttonVariants({ className: "h-10 px-4 text-sm" })}>
          Log in
        </Link>
        <Link
          href="/register"
          className={buttonVariants({ variant: "outline", className: "h-10 px-4 text-sm" })}
        >
          Sign up
        </Link>
      </div>
      <footer className="absolute bottom-6 flex items-center gap-4 text-xs text-muted-foreground">
        <Link href="/docs" className="hover:text-foreground">
          Docs
        </Link>
        <Link href="/legal/privacy" className="hover:text-foreground">
          Privacy
        </Link>
        <Link href="/legal/terms" className="hover:text-foreground">
          Terms
        </Link>
      </footer>
    </main>
  );
};

export default Home;
