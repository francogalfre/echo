"use client";

import { cn } from "@echo/ui/lib/utils";
import { useEffect, useRef } from "react";

type EditableTextProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  ariaLabel: string;
  className?: string;
  maxLength?: number;
};

export const EditableText = ({
  value,
  onChange,
  placeholder,
  ariaLabel,
  className,
  maxLength,
}: EditableTextProps): React.ReactElement => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea || textarea.value !== value) return;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      rows={1}
      value={value}
      maxLength={maxLength}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      aria-label={ariaLabel}
      className={cn(
        "-mx-2 w-full resize-none rounded-md bg-transparent px-2 outline-none transition-colors",
        "placeholder:text-current/40 hover:bg-foreground/5 focus:bg-foreground/5",
        className,
      )}
    />
  );
};
