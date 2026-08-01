"use client";

import { Icons } from "@echo/ui/components/icons";
import { cn } from "@echo/ui/lib/utils";

type OptionCardProps<TValue extends string> = {
  name: string;
  value: TValue;
  label: string;
  description: string;
  icon: typeof Icons.user;
  checked: boolean;
  onSelect: (value: TValue) => void;
};

export const OptionCard = <TValue extends string>({
  name,
  value,
  label,
  description,
  icon: Icon,
  checked,
  onSelect,
}: OptionCardProps<TValue>): React.ReactElement => (
  <label
    className={cn(
      "relative flex cursor-pointer flex-col gap-3 rounded-2xl p-4 ring-1 transition-colors",
      "focus-within:ring-2 focus-within:ring-ring/50",
      checked
        ? "bg-accent/5 ring-2 ring-accent"
        : "ring-foreground/10 hover:bg-muted/40 hover:ring-foreground/20",
    )}
  >
    <input
      type="radio"
      name={name}
      value={value}
      checked={checked}
      onChange={() => onSelect(value)}
      className="sr-only"
    />

    <span className="flex items-center justify-between">
      <span
        className={cn(
          "flex size-9 items-center justify-center rounded-xl transition-colors",
          checked ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground",
        )}
      >
        <Icon className="size-4" />
      </span>
      {checked ? <Icons.circleCheck className="size-4 text-accent" /> : null}
    </span>

    <span>
      <span className="block text-sm font-medium text-foreground">{label}</span>
      <span className="mt-0.5 block text-xs text-muted-foreground">{description}</span>
    </span>
  </label>
);
