import type { CSSProperties, ReactNode } from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { C } from "../theme";

/** A marker swipe that draws left→right behind its text, starting at `from`. */
export function Highlighter({
  children,
  from = 0,
  duration = 14,
  color = C.highlight,
  style,
}: {
  children: ReactNode;
  from?: number;
  duration?: number;
  color?: string;
  style?: CSSProperties;
}) {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [from, from + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.7, 0, 0.3, 1),
  });
  return (
    <span style={{ position: "relative", display: "inline-block", padding: "0 0.12em", ...style }}>
      <span
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "0.3em",
          bottom: "0.04em",
          background: color,
          transformOrigin: "left center",
          transform: `scaleX(${p}) rotate(-0.8deg)`,
          clipPath: "polygon(0 12%, 100% 0, 99% 88%, 1% 100%)",
        }}
      />
      <span style={{ position: "relative" }}>{children}</span>
    </span>
  );
}
