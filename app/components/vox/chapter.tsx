"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/app/lib/utils";
import { TornDivider } from "./torn-divider";

/**
 * One "chapter" of the explainer: torn edge on top, a CHAPTER 0X kicker, and
 * the section body. Keeps the section id so existing #anchors still work.
 *
 * The kicker slides in from the side the camera arrives from on the
 * JourneyBoard (odd chapters from the right, even from the left).
 */
export function Chapter({
  id,
  number,
  kicker,
  children,
  className,
  tone = "bg",
  side = number % 2 ? "right" : "left",
}: {
  id?: string;
  number: number;
  kicker: string;
  children: ReactNode;
  className?: string;
  tone?: "bg" | "bg-2";
  side?: "left" | "right";
}) {
  const from = side === "right" ? 1 : -1;
  return (
    <section
      id={id}
      className={cn("relative", tone === "bg-2" ? "bg-bg-2" : "bg-bg", className)}
    >
      <TornDivider fill={tone === "bg-2" ? "var(--bg-2)" : "var(--bg)"} />
      <div className="w-full px-5 py-20 sm:px-10 sm:py-24 lg:px-16 xl:px-24">
        <motion.p
          initial={{ opacity: 0, x: from * 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={cn(
            "mb-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-fg-subtle",
            side === "right" && "sm:flex-row-reverse",
          )}
        >
          <span className="text-accent-text">Chapter {String(number).padStart(2, "0")}</span>
          <span className="h-px w-10 bg-line-strong" />
          {kicker}
        </motion.p>
        {children}
      </div>
    </section>
  );
}
