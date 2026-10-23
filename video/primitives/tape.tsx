import type { CSSProperties } from "react";
import { C } from "../theme";

/** A strip of masking tape with zig-zag torn ends. */
export function Tape({ width = 140, height = 34, rotate = -3, style }: { width?: number; height?: number; rotate?: number; style?: CSSProperties }) {
  return (
    <div
      style={{
        position: "absolute",
        width,
        height,
        background: C.tape,
        transform: `rotate(${rotate}deg)`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
        clipPath:
          "polygon(0 8%, 3% 0, 6% 10%, 9% 0, 91% 2%, 94% 12%, 97% 0, 100% 8%, 100% 92%, 97% 100%, 94% 90%, 91% 100%, 9% 98%, 6% 88%, 3% 100%, 0 92%)",
        ...style,
      }}
    />
  );
}
