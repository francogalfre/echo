"use client";

import { Button } from "@echo/ui/components/button";
import { Icons } from "@echo/ui/components/icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@echo/ui/components/tooltip";

export function InviteMemberButton(): React.ReactElement {
  return (
    <TooltipProvider delay={200}>
      <Tooltip>
        <TooltipTrigger render={<span className="inline-flex" />}>
          <Button size="lg" disabled>
            <Icons.circlePlus data-icon="inline-start" className="size-4" />
            Invite member
          </Button>
        </TooltipTrigger>
        <TooltipContent>Coming soon</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
