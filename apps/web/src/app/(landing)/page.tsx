import { buttonVariants } from "@echo/ui/components/button";
import Link from "next/link";

const Home = () => {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex items-center gap-2">
        <span className="size-6 rounded-md bg-primary" />
        <span className="font-display text-2xl font-semibold tracking-tight">echo</span>
      </div>
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
    </main>
  );
};

export default Home;
