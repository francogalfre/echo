"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import {
  buttonVariants,
  type ButtonVariantProps,
} from "@echo/ui/components/button-variants";
import { cn } from "@echo/ui/lib/utils";
import { motion, useReducedMotion } from "motion/react";

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & ButtonVariantProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      render={
        <motion.button
          whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
          whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
          transition={{ duration: 0.12 }}
        />
      }
      {...props}
    />
  );
}

export { Button };
