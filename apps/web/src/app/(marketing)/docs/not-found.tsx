import { buttonVariants } from "@echo/ui/components/button-variants";
import { Icons } from "@echo/ui/components/icons";
import Link from "next/link";

const DocsNotFound = (): React.ReactElement => (
  <div className="docs-empty-state flex flex-col items-center text-center">
    <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
      <Icons.search className="size-5" />
    </span>
    <h1 className="mt-5 font-pixel text-xl font-medium">Page not found</h1>
    <p className="mt-2 max-w-xs text-sm text-muted-foreground">
      This doc page doesn&apos;t exist or may have moved.
    </p>
    <Link href="/docs" className={buttonVariants({ size: "sm", className: "mt-6" })}>
      Back to docs
    </Link>
  </div>
);

export default DocsNotFound;
