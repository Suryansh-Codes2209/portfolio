import { TIMELINE_FRAMES } from "../durations";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { education, experience } from "../../app/data/experience";
import { ChapterTag } from "../primitives/caption";
import { Drop } from "../primitives/drop";
import { Kinetic } from "../primitives/kinetic";
import { useLayout } from "../primitives/layout";
import { Paper } from "../primitives/paper";
import { Stamp } from "../primitives/stamp";
import { Tape } from "../primitives/tape";
import { C, F, jitter } from "../theme";

export { TIMELINE_FRAMES };

type Stop = { year: string; title: string; org: string; note: string };

// oldest → newest reads as a story; the stops are spaced along a long strip
// and the camera dollies across it.
const STOPS: Stop[] = [
  { year: education[0].period.split(" ")[0], title: education[0].degree, org: education[0].institution, note: "Where it started" },
  ...[...experience].reverse().map((e) => ({ year: e.period.split(" ")[0], title: e.role, org: e.company, note: e.tech.slice(0, 3).join(" · ") })),
];

const COUNT = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];

/** Ch.4 — the path here: a camera dolly along a pen-drawn timeline. */
export function Timeline() {
  const frame = useCurrentFrame();
  const { width, height, portrait, pad } = useLayout();
  const gap = portrait ? 400 : 620;
  const stripLen = pad * 2 + gap * (STOPS.length - 1) + 600;
  const viewport = portrait ? height : width;
  const travel = Math.max(0, stripLen - viewport + (portrait ? 500 : 0));

  const cam = interpolate(frame, [40, TIMELINE_FRAMES - 50], [0, travel], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  // the pen line leads the camera slightly
  const line = interpolate(frame, [20, TIMELINE_FRAMES - 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const axis = portrait ? 200 : 640; // y (landscape) or x (portrait) of the line
  const pos = (i: number) => pad + 200 + i * gap;
  const reached = (i: number) => line * (stripLen - pad) >= pos(i) - pad;

  return (
    <Paper>
      <ChapterTag n={4} label="The path here" from={2} />
      <div style={{ position: "absolute", left: pad, top: portrait ? 150 : 120, width: portrait ? 940 : 1500, zIndex: 2 }}>
        <Kinetic text={`${COUNT[STOPS.length] ?? STOPS.length} stops. One direction: ship.`} from={6} size={portrait ? 84 : 76} mark={["ship."]} />
      </div>

      {/* in 9:16 the strip scrolls under the headline, so clip it below */}
      <AbsoluteFill style={{ top: portrait ? 400 : 0, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: portrait ? `translateY(${-cam}px)` : `translateX(${-cam}px)` }}>
        {/* the pen line */}
        <div
          style={{
            position: "absolute",
            background: C.pen,
            borderRadius: 4,
            ...(portrait
              ? { left: axis, top: 0, width: 5, height: line * stripLen }
              : { top: axis, left: pad, height: 5, width: line * (stripLen - pad) }),
          }}
        />
        {STOPS.map((st, i) => {
          const p = pos(i);
          const on = reached(i);
          // drop the card the moment the pen line reaches its dot
          const from = Math.round(20 + ((p - pad) / (stripLen - pad)) * (TIMELINE_FRAMES - 80));
          return (
            <div key={i}>
              <div
                style={{
                  position: "absolute",
                  width: 34,
                  height: 34,
                  borderRadius: 99,
                  border: `5px solid ${C.pen}`,
                  background: on ? C.highlight : C.sheet,
                  ...(portrait ? { left: axis - 15, top: p - 17 } : { left: p - 17, top: axis - 15 }),
                }}
              />
              <div
                style={{
                  position: "absolute",
                  fontFamily: F.serif,
                  fontSize: portrait ? 90 : 120,
                  color: C.ink,
                  opacity: on ? 1 : 0.15,
                  ...(portrait ? { left: axis + 60, top: p - 70 } : { left: p - 40, top: axis - 190 }),
                }}
              >
                {st.year}
              </div>
              <Drop
                from={from}
                rotate={jitter(st.org) * 3}
                style={portrait ? { left: axis + 60, top: p + 40, width: 700 } : { left: p - 60, top: axis + 60, width: 520 }}
              >
                <div style={{ position: "relative", background: C.sheet, padding: "30px 32px", boxShadow: "0 1px 0 rgba(0,0,0,0.05)" }}>
                  <Tape width={110} rotate={-5} style={{ left: 30, top: -16 }} />
                  <div style={{ fontFamily: F.mono, fontSize: 18, letterSpacing: "0.18em", color: C.pen, textTransform: "uppercase" }}>{st.org}</div>
                  <div style={{ fontFamily: F.serif, fontSize: 46, lineHeight: 1.05, color: C.ink, margin: "8px 0" }}>{st.title}</div>
                  <div style={{ fontFamily: F.sans, fontSize: 21, color: C.inkMuted }}>{st.note}</div>
                </div>
              </Drop>
            </div>
          );
        })}
        <Stamp
          from={TIMELINE_FRAMES - 70}
          rotate={-10}
          size={40}
          style={portrait ? { left: axis + 120, top: pos(STOPS.length - 1) + 380 } : { left: pos(STOPS.length - 1) + 30, top: axis - 330 }}
        >
          Present
        </Stamp>
      </AbsoluteFill>
      </AbsoluteFill>
    </Paper>
  );
}
