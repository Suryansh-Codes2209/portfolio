import { MACGET_FRAMES } from "../durations";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { compact } from "../../app/data/stats";
import { ChapterTag } from "../primitives/caption";
import { Drop } from "../primitives/drop";
import { Kinetic } from "../primitives/kinetic";
import { useLayout } from "../primitives/layout";
import { Paper } from "../primitives/paper";
import { PEN_PATHS, Pen } from "../primitives/pen";
import { Tape } from "../primitives/tape";
import { Typewriter } from "../primitives/typewriter";
import { C, F, jitter } from "../theme";

export { MACGET_FRAMES };

export type ProofStats = { githubStars: number; macgetDownloads: number };

const CHUNKS = 8;

/** A macOS window, cut out of paper, running a chunked download. */
function DownloadWindow({ from }: { from: number }) {
  const frame = useCurrentFrame();
  const t = frame - from;
  const done = t > 150;
  return (
    <div style={{ width: 860, background: C.sheet, borderRadius: 18, overflow: "hidden", border: `2px solid ${C.ink}` }}>
      <div style={{ display: "flex", gap: 10, padding: "16px 20px", borderBottom: `2px solid ${C.ink}`, background: C.paper2 }}>
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <span key={c} style={{ width: 16, height: 16, borderRadius: 99, background: c, border: `1.5px solid ${C.ink}` }} />
        ))}
        <span style={{ marginLeft: 16, fontFamily: F.mono, fontSize: 20, color: C.inkMuted }}>MacGet — 8 connections</span>
      </div>
      <div style={{ padding: 28, fontSize: 24 }}>
        <Typewriter text="$ macget add ubuntu-24.04-desktop.iso" from={from + 6} cps={34} caret={false} />
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${CHUNKS}, 1fr)`, gap: 6, margin: "26px 0 18px" }}>
          {Array.from({ length: CHUNKS }, (_, i) => {
            // every chunk races at its own speed — that's the whole point
            const speed = 0.75 + (jitter(`chunk${i}`) + 1) * 0.35;
            const p = interpolate(t, [30, 30 + 115 / speed], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.quad),
            });
            return (
              <div key={i} style={{ height: 46, border: `2px solid ${C.ink}`, borderRadius: 6, background: C.paper, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${p * 100}%`, background: p >= 1 ? C.pen : C.highlight }} />
              </div>
            );
          })}
        </div>
        <div style={{ fontFamily: F.mono, fontSize: 22, color: done ? C.pen : C.inkMuted, fontWeight: done ? 700 : 400 }}>
          {done ? "✓ 6.1 GB — done, stitched, verified" : "↓ chunked HTTP · parallel ranges"}
        </div>
      </div>
    </div>
  );
}

/** A sticky note with a number that counts up. */
function StatNote({ label, value, from, tint, rotate }: { label: string; value: number; from: number; tint: string; rotate: number }) {
  const frame = useCurrentFrame();
  const n = interpolate(frame, [from + 10, from + 55], [0, value], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div style={{ position: "relative", width: 360, padding: "34px 34px 30px", background: tint, transform: `rotate(${rotate}deg)` }}>
      <Tape width={120} rotate={-4} style={{ left: 120, top: -16 }} />
      <div style={{ fontFamily: F.serif, fontSize: 132, lineHeight: 1, color: C.ink }}>{compact(Math.round(n))}</div>
      <div style={{ fontFamily: F.mono, fontSize: 22, letterSpacing: "0.18em", textTransform: "uppercase", color: C.inkMuted, marginTop: 10 }}>
        {label}
      </div>
    </div>
  );
}

/** Ch.1 — the flagship: MacGet. */
export function MacGet({ stats }: { stats: ProofStats }) {
  const frame = useCurrentFrame();
  const { portrait, pad } = useLayout();
  const hasStats = stats.githubStars > 0 || stats.macgetDownloads > 0;
  const drift = interpolate(frame, [0, MACGET_FRAMES], [0, -30]);

  return (
    <Paper>
      <ChapterTag n={1} label="The flagship" from={2} />
      <div style={{ position: "absolute", left: pad, top: portrait ? 170 : 150, width: portrait ? 940 : 1700 }}>
        <Kinetic text="Mac downloads were slow. So he built his own." from={6} size={portrait ? 92 : 88} mark={["own."]} />
      </div>

      <AbsoluteFill style={{ transform: `translateY(${drift}px)` }}>
        <Drop from={50} rotate={-2} style={portrait ? { left: pad - 20, top: 640 } : { left: pad, top: 450 }}>
          <DownloadWindow from={56} />
        </Drop>

        <Drop from={40} rotate={8} style={portrait ? { right: pad, top: 520 } : { left: pad + 760, top: 395 }}>
          <Img src={staticFile("macget-icon.png")} style={{ width: 150, filter: "drop-shadow(0 6px 0 #fff)" }} />
        </Drop>

        {hasStats ? (
          <>
            <Drop from={210} rotate={-3} style={portrait ? { left: pad, top: 1340 } : { right: pad + 330, top: 470 }}>
              <StatNote label="Downloads" value={stats.macgetDownloads} from={210} tint={C.sticky.yellow} rotate={0} />
            </Drop>
            <Drop from={235} rotate={4} style={portrait ? { right: pad, top: 1420 } : { right: pad - 20, top: 560 }}>
              <StatNote label="GitHub stars" value={stats.githubStars} from={235} tint={C.sticky.pink} rotate={0} />
            </Drop>
            <Pen
              d={PEN_PATHS.circle}
              from={300}
              duration={20}
              width={5}
              w={460}
              h={230}
              style={portrait ? { left: pad - 50, top: 1330 } : { right: pad + 300, top: 455 }}
            />
          </>
        ) : (
          <Drop from={210} rotate={-3} style={portrait ? { left: pad, top: 1360 } : { right: pad + 80, top: 500 }}>
            <div style={{ position: "relative", padding: "34px 40px", background: C.sticky.yellow, fontFamily: F.serif, fontSize: 84, lineHeight: 1.05 }}>
              <Tape width={120} rotate={-4} style={{ left: 120, top: -16 }} />
              Free.
              <br />
              Open source.
            </div>
          </Drop>
        )}

        {hasStats && (
        <div
          style={{
            position: "absolute",
            fontFamily: F.mono,
            fontSize: 24,
            color: C.pen,
            opacity: interpolate(frame, [320, 335], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            ...(portrait ? { left: pad, bottom: 150 } : { right: pad, bottom: 80 }),
          }}
        >
          ↑ real numbers, live from GitHub
        </div>
        )}
      </AbsoluteFill>
    </Paper>
  );
}
