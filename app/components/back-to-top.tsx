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
      className="fixed bottom-8 right-6 z-50 flex items-center justify-center w-10 h-10 rounded-full border border-claude-500/30 bg-bg/90 backdrop-blur text-accent-text hover:border-claude-400/60 hover:text-accent-text transition-colors shadow-[0_0_20px_rgba(217,119,87,0.2)] cursor-pointer"
      aria-label="Back to top"
    >
      <ArrowUp className="w-4 h-4" />
    </motion.button>
  );
}
