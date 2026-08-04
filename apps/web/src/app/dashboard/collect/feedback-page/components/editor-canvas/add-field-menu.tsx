"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@echo/ui/components/dropdown-menu";
import { Icons } from "@echo/ui/components/icons";

export type AddableField = "enableEmail" | "enableRating";

const ADDABLE_FIELD_META: Record<
  AddableField,
  { icon: (props: { className?: string }) => React.ReactElement; description: string }
> = {
  enableEmail: {
    icon: Icons.mail,
    description: "Collect a way to follow up with users",
  },
  enableRating: {
    icon: Icons.star,
    description: "Let users rate their experience",
  },
};

type AddFieldMenuProps = {
  fields: { field: AddableField; label: string }[];
  onAdd: (field: AddableField) => void;
};

export function AddFieldMenu({
  fields,
  onAdd,
}: AddFieldMenuProps): React.ReactElement | null {
  if (fields.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="group flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border py-3 text-sm font-medium text-muted-foreground outline-none transition-[border-color,background-color,color] duration-150 hover:border-accent/40 hover:bg-accent/5 hover:text-accent aria-expanded:border-accent/40 aria-expanded:bg-accent/5 aria-expanded:text-accent">
        <span className="flex size-6 items-center justify-center rounded-full bg-muted transition-colors group-hover:bg-accent/10 group-aria-expanded:bg-accent/10">
          <Icons.circlePlus className="size-3.5" />
        </span>
        Add a field
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-72">
        {fields.map((addable) => {
          const meta = ADDABLE_FIELD_META[addable.field];
          return (
            <DropdownMenuItem
              key={addable.field}
              onClick={() => onAdd(addable.field)}
              className="gap-3 py-2.5"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <meta.icon className="size-4" />
              </span>
              <div className="flex min-w-0 flex-col">
                <span className="text-sm font-medium text-foreground">{addable.label}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {meta.description}
                </span>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
