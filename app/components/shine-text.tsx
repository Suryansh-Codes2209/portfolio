"use client";

import { useInView } from "framer-motion";
import { ElementType, PropsWithChildren, useRef } from "react";

type Props = PropsWithChildren<{
  as?: ElementType;
  className?: string;
  delay?: number;
  baseColor?: string;
  highlight?: string;
}>;

/**
 * Sweeps a warm highlight across text the first time it scrolls into view.
 * Uses background-clip so the shine is painted onto the glyphs, not a block behind them.
 */
export function ShineText({
  as: Tag = "span",
  className = "",
  delay = 0,
  baseColor = "#E4E4E7",
  highlight = "#FFE5CF",
  children,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px -80px 0px" });

  const gradient = `linear-gradient(110deg, ${baseColor} 0%, ${baseColor} 42%, ${highlight} 48%, #FFFFFF 50%, ${highlight} 52%, ${baseColor} 58%, ${baseColor} 100%)`;

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        backgroundImage: gradient,
        backgroundSize: "250% 100%",
        backgroundRepeat: "no-repeat",
        backgroundPosition: inView ? "0% center" : "100% center",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        color: "transparent",
        transition: `background-position 1.5s cubic-bezier(.2,.7,.2,1) ${delay}s`,
      }}
    >
      {children}
    </Tag>
  );
}
