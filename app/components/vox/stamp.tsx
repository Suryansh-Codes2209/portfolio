import type { ReactNode } from "react";
import { cn } from "@/app/lib/utils";

/** A rubber-stamp label: double red border, slight tilt, ink-worn texture. */
export function Stamp({ children, className, rotate = -6 }: { children: ReactNode; className?: string; rotate?: number }) {
  return (
    <span
      style={{ transform: `rotate(${rotate}deg)` }}
      className={cn(
        "inline-flex items-center gap-1.5 border-2 border-accent px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-accent-text outline outline-1 outline-offset-2 outline-accent/60 [mask-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='1.2'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -2.2 2.2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")]",
        className,
      )}
    >
      {children}
    </span>
  );
}
