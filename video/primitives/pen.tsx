import type { CSSProperties } from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { C } from "../theme";

export const PEN_PATHS = {
  circle: "M58 3 C 88 2, 99 14, 97 23 C 95 34, 70 39, 46 38 C 18 37, 2 30, 3 20 C 4 9, 24 3, 50 3 C 66 3, 78 6, 84 9",
  underline: "M2 34 C 22 31, 45 37, 66 33 S 92 31, 98 35",
  arrow: "M4 36 C 30 30, 60 22, 92 6 M 78 5 L 93 5 L 89 18",
  arrowDown: "M50 2 C 46 14, 54 24, 50 36 M 40 27 L 50 37 L 60 27",
  box: "M3 4 L 97 3 L 96 37 L 4 38 Z",
  tick: "M10 22 L 38 36 L 92 4",
} as const;

/**
 * Scale a path drawn in the 100×40 design box to w×h. Every path above is
 * absolute x/y pairs, so scaling pair-wise is exact. Scaling the coordinates
 * (instead of stretching the SVG) keeps the stroke uniform and keeps the
 * dash maths honest — a stretched SVG with non-scaling-stroke breaks the
 * draw-on into fragments.
 */
export function scalePath(d: string, w: number, h: number) {
  return d.replace(/(-?\d*\.?\d+)[ ,]+(-?\d*\.?\d+)/g, (_, x, y) => `${((+x * w) / 100).toFixed(1)} ${((+y * h) / 40).toFixed(1)}`);
}

/**
 * A red-pen stroke that draws itself over a w×h box. Position it absolutely
 * over whatever it annotates via `style`.
 */
export function Pen({
  d,
  w,
  h,
  from = 0,
  duration = 18,
  color = C.pen,
  width = 4,
  style,
}: {
  d: string;
  w: number;
  h: number;
  from?: number;
  duration?: number;
  color?: string;
  width?: number;
  style?: CSSProperties;
}) {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [from, from + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: "absolute", overflow: "visible", ...style }}>
      <path
        d={scalePath(d, w, h)}
        pathLength={1}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={1}
        strokeDashoffset={1 - p}
        opacity={p > 0 ? 1 : 0}
      />
    </svg>
  );
}
