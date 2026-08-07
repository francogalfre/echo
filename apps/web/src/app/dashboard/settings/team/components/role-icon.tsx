import { Icons } from "@echo/ui/components/icons";

import type { MemberRole } from "./member-role";

type RoleIconProps = {
  role: MemberRole;
  className?: string;
};

export function RoleIcon({ role, className }: RoleIconProps): React.ReactElement {
  if (role === "owner") return <Icons.crown className={className} />;
  if (role === "admin") return <Icons.shield className={className} />;
  return <Icons.user className={className} />;
}
