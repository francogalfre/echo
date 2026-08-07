"use client";

import { Icons } from "@echo/ui/components/icons";
import { cn } from "@echo/ui/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useSyncExternalStore } from "react";

type ToastType = "success" | "error" | "warning" | "info" | "message";

type Toast = {
  id: string;
  type: ToastType;
  message: string;
  description?: string;
  duration: number;
};

type ToastOptions = {
  description?: string;
  duration?: number;
};

type ToasterPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

const DEFAULT_DURATION_MS = 4000;
const ERROR_DURATION_MS = 6000;
const MAX_VISIBLE_TOASTS = 4;

let toasts: Toast[] = [];
const listeners = new Set<() => void>();
const timers = new Map<string, ReturnType<typeof setTimeout>>();

function emitChange(): void {
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): Toast[] {
  return toasts;
}

function clearTimer(id: string): void {
  const timer = timers.get(id);
  if (timer !== undefined) {
    clearTimeout(timer);
    timers.delete(id);
  }
}

function dismiss(id?: string): void {
  if (id === undefined) {
    for (const toast of toasts) {
      clearTimer(toast.id);
    }
    toasts = [];
    emitChange();
    return;
  }

  clearTimer(id);
  toasts = toasts.filter((toast) => toast.id !== id);
  emitChange();
}

function createToastId(): string {
  return `toast_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function push(type: ToastType, message: string, opts?: ToastOptions): string {
  const id = createToastId();
  const duration =
    opts?.duration ?? (type === "error" ? ERROR_DURATION_MS : DEFAULT_DURATION_MS);

  const nextToast: Toast = { id, type, message, description: opts?.description, duration };
  toasts = [...toasts, nextToast].slice(-MAX_VISIBLE_TOASTS);
  emitChange();

  const timer = setTimeout(() => dismiss(id), duration);
  timers.set(id, timer);

  return id;
}

const toast = {
  success: (message: string, opts?: ToastOptions): string => push("success", message, opts),
  error: (message: string, opts?: ToastOptions): string => push("error", message, opts),
  warning: (message: string, opts?: ToastOptions): string => push("warning", message, opts),
  info: (message: string, opts?: ToastOptions): string => push("info", message, opts),
  message: (message: string, opts?: ToastOptions): string => push("message", message, opts),
  dismiss,
};

const TOAST_ICONS: Partial<Record<ToastType, typeof Icons.circleCheck>> = {
  success: Icons.circleCheck,
  error: Icons.cancelCircle,
  warning: Icons.triangleAlert,
  info: Icons.info,
};

const TOAST_ICON_COLORS: Record<ToastType, string> = {
  success: "text-success",
  error: "text-destructive",
  warning: "text-warning",
  info: "text-info",
  message: "",
};

const POSITION_CLASSES: Record<ToasterPosition, string> = {
  "top-left": "top-4 left-4 items-start",
  "top-right": "top-4 right-4 items-end",
  "bottom-left": "bottom-4 left-4 items-start",
  "bottom-right": "toast-bottom-right right-4 items-end",
};

type ToastCardProps = {
  toast: Toast;
  reducedMotion: boolean;
};

function ToastCard({ toast: item, reducedMotion }: ToastCardProps): React.JSX.Element {
  const Icon = TOAST_ICONS[item.type];
  const role = item.type === "error" ? "alert" : "status";
  const ariaLive = item.type === "error" ? "assertive" : "polite";

  return (
    <motion.div
      layout={!reducedMotion}
      initial={
        reducedMotion ? false : { opacity: 0, y: 28, scale: 0.92, filter: "blur(4px)" }
      }
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      exit={
        reducedMotion
          ? { opacity: 0 }
          : { opacity: 0, scale: 0.94, filter: "blur(2px)", transition: { duration: 0.15 } }
      }
      transition={
        reducedMotion
          ? { duration: 0.15 }
          : { type: "spring", stiffness: 420, damping: 32, mass: 0.7 }
      }
      role={role}
      aria-live={ariaLive}
      className={cn(
        "toast-viewport group pointer-events-auto flex items-start gap-3 rounded-xl border",
        "bg-popover px-4 py-3.5 text-popover-foreground shadow-lg",
      )}
    >
      {Icon !== undefined ? (
        <Icon className={cn("mt-0.5 size-4 shrink-0", TOAST_ICON_COLORS[item.type])} />
      ) : null}

      <div className="flex-1 space-y-0.5">
        <p className="text-sm font-medium">{item.message}</p>
        {item.description !== undefined ? (
          <p className="text-xs text-muted-foreground">{item.description}</p>
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => dismiss(item.id)}
        aria-label="Dismiss notification"
        className={cn(
          "-mr-1 -mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md",
          "text-muted-foreground opacity-0 transition-opacity hover:bg-muted",
          "group-hover:opacity-100",
        )}
      >
        <Icons.x className="size-3.5" />
      </button>
    </motion.div>
  );
}

type ToasterProps = {
  position?: ToasterPosition;
};

function Toaster({ position = "bottom-right" }: ToasterProps): React.JSX.Element {
  const list = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <div
      role="region"
      aria-label="Notifications"
      className={cn(
        "toast-viewport pointer-events-none fixed z-[100] flex flex-col gap-2.5",
        POSITION_CLASSES[position],
      )}
    >
      <AnimatePresence initial={false}>
        {list.map((item) => (
          <ToastCard key={item.id} toast={item} reducedMotion={reducedMotion} />
        ))}
      </AnimatePresence>
    </div>
  );
}

export { toast, Toaster };
export type { ToastType, ToastOptions, ToasterPosition };
