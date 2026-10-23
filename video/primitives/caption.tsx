import type { CSSProperties, ReactNode } from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C, F } from "../theme";

/** Small mono "FIG. 01 —" style label that fades up. */
export function Caption({ children, from = 0, style }: { children: ReactNode; from?: number; style?: CSSProperties }) {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [from, from + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        fontFamily: F.mono,
        fontSize: 22,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: C.inkMuted,
        opacity: o,
        transform: `translateY(${(1 - o) * 10}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** "CHAPTER 0X" kicker shared by every scene, top-left. */
export function ChapterTag({ n, label, from = 0 }: { n: number; label: string; from?: number }) {
  return (
    <Caption from={from} style={{ position: "absolute", top: 64, left: 80, display: "flex", gap: 18, alignItems: "center" }}>
      <span style={{ color: C.pen }}>Chapter {String(n).padStart(2, "0")}</span>
      <span style={{ width: 60, height: 2, background: C.line }} />
      <span>{label}</span>
    </Caption>
  );
}
