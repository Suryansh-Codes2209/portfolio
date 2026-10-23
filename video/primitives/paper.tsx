import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "../theme";

/**
 * The newsprint backdrop every scene sits on: paper colour, fibre noise that
 * re-seeds every 3 frames (a "boiling" print texture) and a soft vignette.
 */
export function Paper({ children, color = C.paper, style }: { children?: ReactNode; color?: string; style?: CSSProperties }) {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 3) % 6;
  return (
    <AbsoluteFill style={{ backgroundColor: color, ...style }}>
      {children}
      <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "multiply", opacity: 0.22 }}>
        <svg width="100%" height="100%">
          <filter id={`fibre-${seed}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves={3} seed={seed} stitchTiles="stitch" />
            <feColorMatrix values="0 0 0 0 0.3  0 0 0 0 0.25  0 0 0 0 0.2  0 0 0 0.55 0" />
          </filter>
          <rect width="100%" height="100%" filter={`url(#fibre-${seed})`} />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: "radial-gradient(ellipse at center, transparent 55%, rgba(60,40,20,0.22) 100%)",
        }}
      />
    </AbsoluteFill>
  );
}
