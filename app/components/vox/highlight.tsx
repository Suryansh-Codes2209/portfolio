"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/app/lib/utils";

/**
 * A highlighter swipe that draws in behind the text the first time it scrolls
 * into view. The text keeps its own colour; a dark-ink copy is clipped to the
 * band and wipes in with it, so glyphs poking out of the band stay legible on
 * a dark page.
 */
export function Highlight({
  children,
  className,
  delay = 0.2,
  color = "var(--highlight)",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  color?: string;
}) {
  const anim = {
    viewport: { once: true, margin: "-40px" },
    transition: { duration: 0.55, delay, ease: [0.7, 0, 0.3, 1] },
  } as const;

  return (
    <span className={cn("relative inline-block whitespace-nowrap px-[0.12em]", className)}>
      <motion.span
        aria-hidden
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        {...anim}
        style={{ background: color }}
        className="absolute inset-x-0 bottom-[0.06em] top-[0.32em] -z-0 origin-left -rotate-[0.8deg] rounded-[2px] [clip-path:polygon(0_12%,100%_0,99%_88%,1%_100%)]"
      />
      <span className="relative">{children}</span>
      <motion.span
        aria-hidden
        initial={{ clipPath: "inset(0.36em 100% 0.1em 0)" }}
        whileInView={{ clipPath: "inset(0.36em 0% 0.1em 0)" }}
        {...anim}
        className="absolute inset-0 px-[0.12em] text-highlight-ink"
      >
        {children}
      </motion.span>
    </span>
  );
}
