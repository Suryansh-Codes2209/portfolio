"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/app/lib/utils";

type Kind = "circle" | "underline" | "arrow" | "bracket" | "box";

// Hand-drawn paths in a 100×40 box (stretched to the wrapped content). The
// circle overshoots its start so it reads as one quick pen stroke.
const PATHS: Record<Kind, string> = {
  circle: "M58 3 C 88 2, 99 14, 97 23 C 95 34, 70 39, 46 38 C 18 37, 2 30, 3 20 C 4 9, 24 3, 50 3 C 66 3, 78 6, 84 9",
  underline: "M2 34 C 22 31, 45 37, 66 33 S 92 31, 98 35",
  arrow: "M4 36 C 30 30, 60 22, 92 6 M 78 5 L 93 5 L 89 18",
  bracket: "M10 2 C 3 2, 3 8, 3 20 C 3 32, 3 38, 10 38",
  box: "M3 4 L 97 3 L 96 37 L 4 38 Z",
};

/**
 * Red-pen annotation drawn around/under/next to its children, stroke by stroke,
 * when it scrolls into view.
 */
export function Annotate({
  children,
  kind = "circle",
  className,
  delay = 0.3,
  color = "var(--accent)",
  strokeWidth = 2.5,
}: {
  children: ReactNode;
  kind?: Kind;
  className?: string;
  delay?: number;
  color?: string;
  strokeWidth?: number;
}) {
  const overflow =
    kind === "circle" ? "-inset-x-[14%] -inset-y-[30%]" : kind === "underline" ? "inset-x-0 -bottom-[40%] top-[55%]" : "inset-0";

  return (
    <span className={cn("relative inline-block", className)}>
      {children}
      <svg
        aria-hidden
        viewBox="0 0 100 40"
        preserveAspectRatio="none"
        className={cn("pointer-events-none absolute overflow-visible", overflow)}
      >
        <motion.path
          d={PATHS[kind]}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.8, delay, ease: "easeInOut" }}
        />
      </svg>
    </span>
  );
}
