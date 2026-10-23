import { CASE_FILES_FRAMES } from "../durations";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { projects } from "../../app/data/projects";
import { ChapterTag } from "../primitives/caption";
import { Drop } from "../primitives/drop";
import { Kinetic } from "../primitives/kinetic";
import { useLayout } from "../primitives/layout";
import { Paper } from "../primitives/paper";
import { PEN_PATHS, Pen } from "../primitives/pen";
import { C, F, jitter } from "../theme";

export { CASE_FILES_FRAMES };

// First sentence, trimmed on a word boundary so a card never ends mid-word.
const firstSentence = (s: string, max = 110) => {
  const cut = s.split(/(?<=[.!?])\s/)[0];
  if (cut.length <= max) return cut;
  return `${cut.slice(0, cut.lastIndexOf(" ", max)).replace(/[,:;—\s]+$/, "")}…`;
};

/** A red push-pin. */
function Pin({ x, y }: { x: number; y: number }) {
  return (
    <div
      style={{
        position: "absolute",
        left: x - 14,
        top: y - 14,
        width: 28,
        height: 28,
        borderRadius: 99,
        background: `radial-gradient(circle at 35% 35%, #ff8a6b, ${C.pen} 55%, #7a2e17)`,
        boxShadow: "0 4px 6px rgba(0,0,0,0.35)",
      }}
    />
  );
}

/** Ch.2 — every project pinned to a cork board, joined by red string. */
export function CaseFiles() {
  const frame = useCurrentFrame();
  const { width, height, portrait, pad } = useLayout();
  const cardW = portrait ? 860 : 700;

  // pin positions (card top-centre) in screen space
  const slots = portrait
    ? projects.map((_, i) => ({ x: width / 2 + (i % 2 ? 40 : -40), y: 520 + i * 330 }))
    : projects.map((_, i) => ({ x: pad + cardW / 2 + (i % 2) * (cardW + 140) + (i >= 2 ? 60 : 0), y: 330 + Math.floor(i / 2) * 340 }));

  const pan = interpolate(frame, [0, CASE_FILES_FRAMES], [0, portrait ? -40 : -20]);
  const stringP = (i: number) =>
    interpolate(frame, [150 + i * 18, 180 + i * 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <Paper color={C.board}>
      {/* cork speckle */}
      <AbsoluteFill
        style={{
          backgroundImage: "radial-gradient(rgba(90,55,20,0.35) 1.4px, transparent 1.6px), radial-gradient(rgba(255,235,200,0.25) 1px, transparent 1.4px)",
          backgroundSize: "17px 19px, 23px 21px",
          backgroundPosition: "0 0, 9px 7px",
        }}
      />
      <ChapterTag n={2} label="The case files" from={2} />
      <div style={{ position: "absolute", left: pad, top: portrait ? 150 : 120, width: portrait ? 940 : 1400 }}>
        <Kinetic text="He doesn't just talk about it. He ships." from={6} size={portrait ? 84 : 76} mark={["ships."]} color={C.ink} />
      </div>

      <AbsoluteFill style={{ transform: `translateY(${pan}px)` }}>
        {/* red string between consecutive pins */}
        <svg width={width} height={height} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {slots.slice(1).map((b, i) => {
            const a = slots[i];
            const p = stringP(i);
            const mx = (a.x + b.x) / 2;
            const my = Math.max(a.y, b.y) + 60; // string sags
            return (
              <path
                key={i}
                d={`M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`}
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - p}
                stroke="#b3261e"
                strokeWidth={4}
                fill="none"
                opacity={p > 0 ? 1 : 0}
              />
            );
          })}
        </svg>

        {projects.map((proj, i) => {
          const slot = slots[i];
          const [name, kind] = proj.title.split(" — ");
          return (
            <Drop key={proj.title} from={30 + i * 22} rotate={jitter(proj.title) * 3} style={{ left: slot.x - cardW / 2, top: slot.y - 10, width: cardW }}>
              <div style={{ background: C.sheet, padding: "34px 38px 30px", backgroundImage: `repeating-linear-gradient(transparent 0 37px, rgba(80,120,170,0.25) 37px 38px)` }}>
                <div style={{ fontFamily: F.mono, fontSize: 18, letterSpacing: "0.2em", color: C.pen, textTransform: "uppercase" }}>
                  Case {String(i + 1).padStart(2, "0")}
                  {kind ? ` · ${kind}` : ""}
                </div>
                <div style={{ fontFamily: F.serif, fontSize: 64, lineHeight: 1.05, color: C.ink, margin: "6px 0 10px" }}>{name}</div>
                <div style={{ fontFamily: F.sans, fontSize: 24, lineHeight: 1.35, color: C.inkMuted }}>{firstSentence(proj.description)}</div>
                <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                  {proj.tags.slice(0, 3).map((t) => (
                    <span key={t} style={{ fontFamily: F.mono, fontSize: 18, padding: "4px 10px", border: `1.5px solid ${C.ink}`, color: C.ink }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <Pin x={cardW / 2} y={10} />
            </Drop>
          );
        })}

        <Pen
          d={PEN_PATHS.circle}
          from={250}
          duration={22}
          width={6}
          w={cardW + 90}
          h={portrait ? 360 : 380}
          style={{ left: slots[0].x - cardW / 2 - 45, top: slots[0].y - 60 }}
        />
      </AbsoluteFill>
    </Paper>
  );
}
