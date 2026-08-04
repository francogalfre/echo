"use client";

import { Button } from "@echo/ui/components/button";
import { Icons } from "@echo/ui/components/icons";
import type { ReactNode } from "react";

type BackButtonProps = {
  onClick: () => void;
};

export const BackButton = ({ onClick }: BackButtonProps): React.ReactElement => (
  <Button
    type="button"
    variant="outline"
    onClick={onClick}
    aria-label="Go back"
    className="size-11 shrink-0 rounded-xl"
  >
    <Icons.arrowLeft className="size-4" />
  </Button>
);

type ContinueButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  form?: string;
  pending?: boolean;
  disabled?: boolean;
  className?: string;
};

export const ContinueButton = ({
  children,
  onClick,
  type = "button",
  form,
  pending = false,
  disabled = false,
  className,
}: ContinueButtonProps): React.ReactElement => (
  <Button
    type={type}
    form={form}
    onClick={onClick}
    disabled={pending || disabled}
    className={className ?? "h-11 flex-1 rounded-xl text-sm"}
  >
    {pending ? (
      <Icons.loading className="size-4 animate-spin" />
    ) : (
      <>
        {children}
        <Icons.arrowRight data-icon="inline-end" className="size-4" />
      </>
    )}
  </Button>
);
