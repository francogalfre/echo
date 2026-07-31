import { Avatar, AvatarFallback } from "@echo/ui/components/avatar";
import { cn } from "@echo/ui/lib/utils";

const ACCENT_AVATAR_STYLE = {
  "--avatar-bg": "oklch(0.6 0.14 282.7 / 0.16)",
  "--avatar-fg-light": "oklch(0.45 0.13 282.7)",
  "--avatar-fg-dark": "oklch(0.82 0.09 282.7)",
} as React.CSSProperties;

type AccentAvatarProps = {
  name: string;
  className?: string;
};

export function AccentAvatar({ name, className }: AccentAvatarProps): React.ReactElement {
  return (
    <Avatar className={cn("size-8", className)}>
      <AvatarFallback name={name} style={ACCENT_AVATAR_STYLE} />
    </Avatar>
  );
}
