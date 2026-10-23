"use client";

import { motion } from "framer-motion";
import { cn } from "@/app/lib/utils";
import { Highlight } from "./highlight";

const TAGS = { h1: motion.h1, h2: motion.h2, h3: motion.h3 } as const;

/**
 * A serif headline that drops in word by word, Vox-title style. Pass the
 * word(s) to mark in `highlight`; they get a marker swipe once the line lands.
 * The full text is always in the DOM, so crawlers and screen readers get the
 * sentence as written.
 */
export function KineticHeading({
  text,
  highlight,
  as = "h2",
  className,
}: {
  text: string;
  highlight?: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  const words = text.split(" ");
  const marked = new Set((highlight ?? "").split(" ").filter(Boolean));
  const MotionTag = TAGS[as];

  return (
    <MotionTag
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ staggerChildren: 0.06 }}
      className={cn("font-serif text-4xl leading-[1.02] tracking-tight text-fg sm:text-6xl", className)}
    >
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: "105%", rotate: 4 },
              show: { y: 0, rotate: 0, transition: { duration: 0.55, ease: [0.2, 0.7, 0.2, 1] } },
            }}
          >
            {marked.has(w) ? <Highlight delay={0.15 + words.length * 0.06}>{w}</Highlight> : w}
          </motion.span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </MotionTag>
  );
}
