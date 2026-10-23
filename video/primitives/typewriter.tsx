import type { CSSProperties } from "react";
import { useCurrentFrame } from "remotion";
import { C, F } from "../theme";

/** Types `text` out at `cps` characters per second with a blinking caret. */
export function Typewriter({
  text,
  from = 0,
  cps = 22,
  fps = 30,
  caret = true,
  style,
}: {
  text: string;
  from?: number;
  cps?: number;
  fps?: number;
  caret?: boolean;
  style?: CSSProperties;
}) {
  const frame = useCurrentFrame();
  const n = Math.max(0, Math.min(text.length, Math.floor(((frame - from) / fps) * cps)));
  const done = n >= text.length;
  const blink = Math.floor(frame / 8) % 2 === 0;
  return (
    <span style={{ fontFamily: F.mono, color: C.ink, whiteSpace: "pre", ...style }}>
      {text.slice(0, n)}
      {caret && (!done || blink) ? <span style={{ opacity: frame >= from ? 1 : 0 }}>▌</span> : null}
    </span>
  );
}
