import type { CSSProperties, ReactNode } from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * Drops its child onto the page like a piece of paper: falls from above with a
 * little spin, overshoots, settles at `rotate` degrees. Everything collage-y
 * in the video enters through this.
 */
export function Drop({
  children,
  from = 0,
  rotate = 0,
  dy = -120,
  spin = 8,
  style,
}: {
  children: ReactNode;
  from?: number;
  rotate?: number;
  dy?: number;
  spin?: number;
  style?: CSSProperties;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - from, fps, config: { damping: 13, stiffness: 140, mass: 0.9 } });
  const scale = 1.25 - 0.25 * p;
  return (
    <div
      style={{
        position: "absolute",
        opacity: Math.min(1, p * 3),
        transform: `translateY(${(1 - p) * dy}px) rotate(${rotate + (1 - p) * spin}deg) scale(${scale})`,
        filter: `drop-shadow(0 ${10 + (1 - p) * 30}px ${14 + (1 - p) * 20}px rgba(30,20,10,${0.25 - (1 - p) * 0.1}))`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
