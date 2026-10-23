import type { CSSProperties, ReactNode } from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F } from "../theme";

/** A rubber stamp that slams down (scale 2.4 → 1) at `from`. */
export function Stamp({
  children,
  from = 0,
  rotate = -8,
  size = 34,
  color = C.pen,
  style,
}: {
  children: ReactNode;
  from?: number;
  rotate?: number;
  size?: number;
  color?: string;
  style?: CSSProperties;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - from, fps, config: { damping: 9, stiffness: 260, mass: 0.6 } });
  if (frame < from) return null;
  return (
    <div
      style={{
        position: "absolute",
        fontFamily: F.mono,
        fontWeight: 700,
        fontSize: size,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color,
        border: `4px solid ${color}`,
        outline: `2px solid ${color}`,
        outlineOffset: 5,
        padding: "8px 20px",
        opacity: Math.min(1, p * 2) * 0.92,
        transform: `rotate(${rotate}deg) scale(${2.4 - 1.4 * p})`,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
