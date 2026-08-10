"use client";

import { cn } from "@echo/ui/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { createContext, useContext, useEffect, useId, type ReactNode } from "react";
import { createPortal } from "react-dom";

type ExpandableScreenContextValue = {
  isExpanded: boolean;
  expand: () => void;
  collapse: () => void;
  layoutId: string;
};

const ExpandableScreenContext = createContext<ExpandableScreenContextValue | null>(null);

function useExpandableScreen(): ExpandableScreenContextValue {
  const context = useContext(ExpandableScreenContext);
  if (!context) {
    throw new Error("ExpandableScreen parts must be used within <ExpandableScreen>");
  }
  return context;
}

type ExpandableScreenProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
};

export function ExpandableScreen({
  open,
  onOpenChange,
  children,
}: ExpandableScreenProps): React.ReactElement {
  const layoutId = useId();

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <ExpandableScreenContext.Provider
      value={{
        isExpanded: open,
        expand: () => onOpenChange(true),
        collapse: () => onOpenChange(false),
        layoutId,
      }}
    >
      {children}
    </ExpandableScreenContext.Provider>
  );
}

type ExpandableScreenTriggerProps = {
  children: ReactNode;
  className?: string;
};

export function ExpandableScreenTrigger({
  children,
  className,
}: ExpandableScreenTriggerProps): React.ReactElement | null {
  const { isExpanded, expand, layoutId } = useExpandableScreen();

  if (isExpanded) return null;

  return (
    <motion.div
      layoutId={layoutId}
      className={cn("inline-flex", className)}
      onClick={expand}
    >
      {children}
    </motion.div>
  );
}

type ExpandableScreenContentProps = {
  children: ReactNode;
  className?: string;
};

export function ExpandableScreenContent({
  children,
  className,
}: ExpandableScreenContentProps): React.ReactElement | null {
  const { isExpanded, collapse, layoutId } = useExpandableScreen();

  useEffect(() => {
    if (!isExpanded) return;
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") collapse();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isExpanded, collapse]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={collapse}
          />
          <motion.div
            key="content"
            layoutId={layoutId}
            className={cn(
              "relative flex w-full flex-col overflow-hidden rounded-2xl bg-popover shadow-md ring-1 ring-foreground/10",
              className,
            )}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
