"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

// Makes ALL Framer Motion animations honor the OS "reduce motion" setting.
// CSS media queries don't reach Framer's JS-driven inline transforms, so this
// provider is what actually enforces prefers-reduced-motion across the site.
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
