"use client";

import { motion, useInView } from "framer-motion";
import { type ReactNode, useEffect, useRef, useState } from "react";

// Ported from Aceternity UI's Timeline (MIT, Manu Arora — 21st.dev/@manuarora700).
// The glowing beam is swapped for a red-pen line that inks down once it's in
// view. (In-view rather than scroll-linked: on the JourneyBoard the page
// pans with transforms, which scroll-linked offsets can't see.)

export type TimelineEntry = { title: ReactNode; content: ReactNode };

export function Timeline({ data }: { data: TimelineEntry[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(() => setHeight(ref.current?.getBoundingClientRect().height ?? 0));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  const inView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <div ref={containerRef} className="w-full">
      <div ref={ref} className="relative">
        {data.map((item, i) => (
          <div key={i} className="flex justify-start pt-8 md:gap-10 md:pt-16 first:pt-0">
            <div className="z-40 flex max-w-xs flex-col self-start md:w-full md:flex-row md:items-start lg:max-w-sm">
              <div className="absolute left-[3px] flex h-8 w-8 items-center justify-center rounded-full bg-bg">
                <div className="h-3.5 w-3.5 rounded-full border-2 border-accent bg-surface" />
              </div>
              <div className="hidden md:block md:pl-14">{item.title}</div>
            </div>
            <div className="relative w-full pl-14 pr-2 md:pl-4">
              <div className="mb-4 md:hidden">{item.title}</div>
              {item.content}
            </div>
          </div>
        ))}
        <div
          aria-hidden
          style={{ height: `${height}px` }}
          className="absolute left-[18px] top-0 w-[2px] overflow-hidden bg-[repeating-linear-gradient(to_bottom,var(--line-strong)_0_6px,transparent_6px_12px)]"
        >
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: inView ? height : 0 }}
            transition={{ duration: 2.2, ease: "easeInOut" }}
            className="absolute inset-x-0 top-0 w-[2px] rounded-full bg-accent"
          />
        </div>
      </div>
    </div>
  );
}
