"use client";

import { easings } from "@echo/ui/lib/motion";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import type { ComponentProps, ReactElement, ReactNode } from "react";

const MotionLink = motion.create(Link);

type MotionButtonLinkProps = {
  href: ComponentProps<typeof Link>["href"];
  className?: string;
  children: ReactNode;
};

export const MotionButtonLink = ({
  href,
  className,
  children,
}: MotionButtonLinkProps): ReactElement => {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <MotionLink
      href={href}
      className={className}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.45, ease: easings.out }}
    >
      {children}
    </MotionLink>
  );
};
