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
  scaleOnHover = true,
  ...props
}: ButtonPrimitive.Props & ButtonVariantProps & { scaleOnHover?: boolean }) {
  const prefersReducedMotion = useReducedMotion();
  const animateScale = scaleOnHover && !prefersReducedMotion;

  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      render={
        <motion.button
          whileHover={animateScale ? { scale: 1.02 } : undefined}
          whileTap={animateScale ? { scale: 0.97 } : undefined}
          transition={{ duration: 0.12 }}
        />
      }
      {...props}
    />
  );
}

export { Button };
