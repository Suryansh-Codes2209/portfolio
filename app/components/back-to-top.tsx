"use client";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useState } from "react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setVisible(y > 500));

  return (
    <motion.button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 12 }}
      transition={{ duration: 0.2 }}
      className="paper fixed bottom-8 right-6 z-50 flex items-center gap-1.5 px-3 h-9 -rotate-2 border border-line font-mono text-[10px] uppercase tracking-widest text-fg-muted hover:text-accent-text hover:rotate-0 transition-[color,transform] cursor-pointer"
      aria-label="Back to top"
    >
      <ArrowUp className="w-3.5 h-3.5" /> Top
    </motion.button>
  );
}
