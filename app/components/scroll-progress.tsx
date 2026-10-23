"use client";
import { motion, useScroll, useSpring } from "framer-motion";

/** A highlighter stroke that inks across the top of the page as you read. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden
      className="fixed top-0 left-0 right-0 h-[5px] bg-highlight z-[100] origin-left [clip-path:polygon(0_15%,100%_0,100%_85%,0_100%)]"
      style={{ scaleX }}
    />
  );
}
