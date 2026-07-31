import { Stagger, StaggerItem } from "@echo/ui/components/motion/stagger";
import type { DigestOutput } from "@echo/ai";

export function ThemesContent({ digest }: { digest: DigestOutput }): React.ReactElement {
  return (
    <div className="flex flex-col gap-3">
      {digest.themes.length > 0 ? (
        <Stagger className="flex flex-col gap-2" stagger={0.04}>
          {digest.themes.map((theme) => (
            <StaggerItem key={theme.title}>
              <div className="flex items-start gap-3 rounded-lg border border-border bg-background p-3">
                <span className="mt-0.5 min-w-[1.75rem] rounded-md bg-muted px-1.5 py-0.5 text-center text-xs font-medium tabular-nums text-muted-foreground">
                  {theme.count}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{theme.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{theme.insight}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      ) : (
        <p className="text-sm text-muted-foreground">No themes identified yet.</p>
      )}
    </div>
  );
}
