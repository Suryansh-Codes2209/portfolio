"use client";

import { useInView, useMotionValue, useSpring } from "framer-motion";
import { type ComponentPropsWithoutRef, useEffect, useRef } from "react";
import { cn } from "@/app/lib/utils";

// Ported from Magic UI's NumberTicker (MIT, Dillion Verma — 21st.dev/@dillionverma).
// Added `format` so callers can render compact numbers ("1.2k").

interface NumberTickerProps extends ComponentPropsWithoutRef<"span"> {
  value: number;
  startValue?: number;
  direction?: "up" | "down";
  delay?: number;
  decimalPlaces?: number;
  format?: (n: number) => string;
}

export function NumberTicker({
  value,
  startValue = 0,
  direction = "up",
  delay = 0,
  decimalPlaces = 0,
  format,
  className,
  ...props
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === "down" ? value : startValue);
  const springValue = useSpring(motionValue, { damping: 60, stiffness: 100 });
  const isInView = useInView(ref, { once: true, margin: "0px" });

  const render = (n: number) =>
    format
      ? format(Math.round(n))
      : Intl.NumberFormat("en-US", {
          minimumFractionDigits: decimalPlaces,
          maximumFractionDigits: decimalPlaces,
        }).format(Number(n.toFixed(decimalPlaces)));

  useEffect(() => {
    if (!isInView) return;
    const t = setTimeout(() => motionValue.set(direction === "down" ? startValue : value), delay * 1000);
    return () => clearTimeout(t);
  }, [motionValue, isInView, delay, value, direction, startValue]);

  useEffect(
    () =>
      springValue.on("change", (latest) => {
        if (ref.current) ref.current.textContent = render(latest);
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [springValue, decimalPlaces, format],
  );

  return (
    <span ref={ref} className={cn("inline-block tabular-nums tracking-tight", className)} {...props}>
      {render(startValue)}
    </span>
  );
}
