"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

type Props = { children: ReactNode };

export const MotionProvider = ({ children }: Props): React.ReactElement => (
  <MotionConfig reducedMotion="user">{children}</MotionConfig>
);
