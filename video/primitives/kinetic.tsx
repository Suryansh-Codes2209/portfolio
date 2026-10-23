import type { CSSProperties } from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F } from "../theme";
import { Highlighter } from "./highlighter";

/**
 * Serif title that pops up word by word from behind a baseline mask. Words in
 * `mark` get a highlighter swipe once the whole line has landed.
 */
export function Kinetic({
  text,
  from = 0,
  stagger = 3,
  size = 96,
  mark = [],
  color = C.ink,
  style,
}: {
  text: string;
  from?: number;
  stagger?: number;
  size?: number;
  mark?: string[];
  color?: string;
  style?: CSSProperties;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");
  const landed = from + words.length * stagger + 8;
  return (
    <div style={{ fontFamily: F.serif, fontSize: size, lineHeight: 1.02, color, letterSpacing: "-0.01em", ...style }}>
      {words.map((w, i) => {
        const p = spring({ frame: frame - from - i * stagger, fps, config: { damping: 16, stiffness: 160 } });
        const inner = mark.includes(w) ? <Highlighter from={landed}>{w}</Highlighter> : w;
        return (
          <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom", padding: "0 0.06em 0.08em", margin: "0 -0.06em" }}>
            <span style={{ display: "inline-block", transform: `translateY(${(1 - p) * 105}%) rotate(${(1 - p) * 5}deg)` }}>
              {inner}
            </span>
            {i < words.length - 1 ? " " : null}
          </span>
        );
      })}
    </div>
  );
}
