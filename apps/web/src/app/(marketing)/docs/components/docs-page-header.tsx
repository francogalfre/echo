import { Icons } from "@echo/ui/components/icons";
import Link from "next/link";

type DocsPageHeaderProps = {
  title: string;
  description: string;
  breadcrumb: readonly string[];
};

export const DocsPageHeader = ({
  title,
  description,
  breadcrumb,
}: DocsPageHeaderProps): React.ReactElement => (
  <div>
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground"
    >
      <Link href="/docs" className="transition-colors hover:text-foreground">
        Docs
      </Link>
      {breadcrumb.map((segment, index) => {
        const isLast = index === breadcrumb.length - 1;

        return (
          <span key={segment} className="flex items-center gap-1.5">
            <Icons.chevronRight className="size-3.5 text-muted-foreground/50" />
            <span className={isLast ? "font-medium text-foreground" : undefined}>
              {segment}
            </span>
          </span>
        );
      })}
    </nav>
    <h1 className="mt-4 font-pixel text-3xl font-medium tracking-tight text-balance">
      {title}
    </h1>
    <p className="mt-3 text-muted-foreground text-pretty">{description}</p>
  </div>
);
