import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/app/lib/utils";

/** Stable pseudo-random tilt from a string, so SSR and client agree. */
export function tiltFor(seed: string, range = 2) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return ((Math.abs(h) % 1000) / 1000) * range * 2 - range;
}

interface TapedCardProps extends ComponentPropsWithoutRef<"div"> {
  /** Seeds the tilt; use something stable like a title or slug. */
  seed: string;
  /** "FIG. 01"-style caption under the card. */
  fig?: string;
  tape?: "top" | "corners" | "none";
  tilt?: boolean;
}

/** An evidence card pinned to the page with masking tape. */
export function TapedCard({ seed, fig, tape = "top", tilt = true, className, children, style, ...props }: TapedCardProps) {
  const r = tilt ? tiltFor(seed) : 0;
  return (
    <figure className="relative m-0">
      <div
        {...props}
        style={{ ...style, ["--r" as string]: `${r}deg` }}
        className={cn(
          "paper relative [transform:rotate(var(--r))] transition-transform duration-300 hover:[transform:rotate(0deg)]",
          className,
        )}
      >
        {tape === "top" && <span aria-hidden className="tape absolute -top-3 left-1/2 z-10 h-6 w-24 -translate-x-1/2 rotate-[-2deg]" />}
        {tape === "corners" && (
          <>
            <span aria-hidden className="tape absolute -left-4 -top-2 z-10 h-6 w-16 -rotate-[38deg]" />
            <span aria-hidden className="tape absolute -right-4 -top-2 z-10 h-6 w-16 rotate-[38deg]" />
          </>
        )}
        {children}
      </div>
      {fig && (
        <figcaption className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-fg-faint">{fig}</figcaption>
      )}
    </figure>
  );
}
