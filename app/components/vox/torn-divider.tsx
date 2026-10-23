/**
 * The torn top edge of a chapter. It hangs 24px above its section and is
 * filled with that section's own color, so the tear eats into the one above.
 */
export function TornDivider({ fill = "var(--bg)", className = "" }: { fill?: string; className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-x-0 -top-6 h-6 ${className}`}>
      <svg viewBox="0 0 1200 24" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <path
          d="M0 10 L40 14 L75 8 L120 15 L160 9 L210 13 L250 7 L300 14 L345 9 L390 15 L440 8 L480 13 L530 9 L575 16 L620 8 L670 13 L710 7 L760 14 L805 10 L850 15 L900 8 L945 13 L990 9 L1040 15 L1085 8 L1130 14 L1170 9 L1200 12 V24 H0 Z"
          fill={fill}
        />
        <path
          d="M0 10 L40 14 L75 8 L120 15 L160 9 L210 13 L250 7 L300 14 L345 9 L390 15 L440 8 L480 13 L530 9 L575 16 L620 8 L670 13 L710 7 L760 14 L805 10 L850 15 L900 8 L945 13 L990 9 L1040 15 L1085 8 L1130 14 L1170 9 L1200 12"
          fill="none"
          stroke="var(--line-strong)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
