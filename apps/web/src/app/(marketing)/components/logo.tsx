import { cn } from "@echo/ui/lib/utils";

type LogoProps = {
  className?: string;
};

export const Logo = ({ className }: LogoProps): React.ReactElement => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="size-6 rounded-md bg-accent" />
      <span className="font-display text-2xl font-semibold tracking-tight">echo</span>
    </div>
  );
};
