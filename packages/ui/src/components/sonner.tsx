"use client";

import { Icons } from "@echo/ui/components/icons";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <Icons.circleCheck className="size-4 text-success" />,
        info: <Icons.info className="size-4 text-info" />,
        warning: <Icons.triangleAlert className="size-4 text-warning" />,
        error: <Icons.cancelCircle className="size-4 text-destructive" />,
        loading: <Icons.loading className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
          success: "border-success/40",
          info: "border-info/40",
          warning: "border-warning/40",
          error: "border-destructive/40",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
