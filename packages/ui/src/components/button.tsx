"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import {
  buttonVariants,
  type ButtonVariantProps,
} from "@echo/ui/components/button-variants";
import { cn } from "@echo/ui/lib/utils";
import { motion } from "motion/react";

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & ButtonVariantProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      render={<motion.button whileTap={{ scale: 0.97 }} transition={{ duration: 0.1 }} />}
      {...props}
    />
  );
}

export { Button };
