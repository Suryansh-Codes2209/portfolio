import { RECEIPTS_FRAMES } from "../durations";
import { interpolate, useCurrentFrame } from "remotion";
import { recommendations } from "../../app/data/recommendations";
import { ChapterTag } from "../primitives/caption";
import { Drop } from "../primitives/drop";
import { Highlighter } from "../primitives/highlighter";
import { Kinetic } from "../primitives/kinetic";
import { useLayout } from "../primitives/layout";
import { Paper } from "../primitives/paper";
import { Tape } from "../primitives/tape";
import { C, F } from "../theme";

export { RECEIPTS_FRAMES };

/** The sentence that carries the highlight, split around it. */
function pullQuote(paragraphs: string[], highlight: string) {
  const sentences = paragraphs.join(" ").split(/(?<=[.!?])\s+/);
  const hit = sentences.find((x) => x.includes(highlight)) ?? sentences[0];
  const at = hit.indexOf(highlight);
  return at < 0 ? { before: hit, mark: "", after: "" } : { before: hit.slice(0, at), mark: highlight, after: hit.slice(at + highlight.length) };
}

/** Ch.5 — don't take his word for it: a clipped recommendation. */
export function Receipts() {
  const frame = useCurrentFrame();
  const { portrait, pad } = useLayout();
  const rec = recommendations[0];
  const q = pullQuote(rec.paragraphs, rec.highlight);
  const zoom = interpolate(frame, [60, RECEIPTS_FRAMES], [1, 1.08], { extrapolateLeft: "clamp" });

  return (
    <Paper>
      <ChapterTag n={5} label="The receipts" from={2} />
      <div style={{ position: "absolute", left: pad, top: portrait ? 150 : 120, width: portrait ? 940 : 1500 }}>
        <Kinetic text="Don't take his word for it." from={6} size={portrait ? 92 : 84} mark={["word"]} />
      </div>

      <Drop
        from={40}
        rotate={-1.5}
        style={{ left: pad + (portrait ? 0 : 140), right: pad + (portrait ? 0 : 140), top: portrait ? 520 : 330 }}
      >
        <div
          style={{
            position: "relative",
            background: C.sheet,
            padding: portrait ? "70px 56px 56px" : "70px 90px 60px",
            transform: `scale(${zoom})`,
            transformOrigin: "center top",
            clipPath: "polygon(0 2%, 4% 0, 30% 1.5%, 60% 0, 96% 1%, 100% 0, 99% 50%, 100% 98%, 70% 100%, 40% 98.5%, 8% 100%, 0 99%, 1% 50%)",
          }}
        >
          <Tape width={160} rotate={-4} style={{ left: 80, top: 10 }} />
          <Tape width={160} rotate={5} style={{ right: 80, top: 10 }} />
          <div style={{ fontFamily: F.serif, fontSize: 200, lineHeight: 0.5, color: C.pen, height: 70 }}>“</div>
          <div style={{ fontFamily: F.serif, fontSize: portrait ? 64 : 62, lineHeight: 1.22, color: C.ink }}>
            {q.before}
            {q.mark && <Highlighter from={110} duration={26}>{q.mark}</Highlighter>}
            {q.after}
          </div>
          <div
            style={{
              marginTop: 36,
              fontFamily: F.mono,
              fontSize: 24,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: C.inkMuted,
              opacity: interpolate(frame, [150, 165], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            }}
          >
            — {rec.name} · mentor · via {rec.source}
          </div>
        </div>
      </Drop>
    </Paper>
  );
}
