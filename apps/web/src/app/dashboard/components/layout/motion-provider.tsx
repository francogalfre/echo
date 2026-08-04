"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

type MotionProviderProps = { children: ReactNode };

export const MotionProvider = ({ children }: MotionProviderProps): React.ReactElement => (
  <MotionConfig reducedMotion="user">{children}</MotionConfig>
);
