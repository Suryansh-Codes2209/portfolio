import { CTA_FRAMES } from "../durations";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SITE_URL, SOCIALS } from "../../app/data/site";
import { Kinetic } from "../primitives/kinetic";
import { useLayout } from "../primitives/layout";
import { Paper } from "../primitives/paper";
import { PEN_PATHS, Pen } from "../primitives/pen";
import { Typewriter } from "../primitives/typewriter";
import { C, F } from "../theme";

export { CTA_FRAMES };

/** Outro — the URL, circled in red pen. */
export function Cta() {
  const frame = useCurrentFrame();
  const { portrait } = useLayout();
  const host = SITE_URL.replace(/^https?:\/\//, "");
  const handle = SOCIALS.x.split("/").pop();
  const settle = interpolate(frame, [0, CTA_FRAMES], [1.04, 1]);

  return (
    <Paper>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", transform: `scale(${settle})` }}>
        <Kinetic text="Want the full story?" from={4} size={portrait ? 80 : 72} style={{ color: C.inkMuted, fontStyle: "italic", textAlign: "center" }} />
        <div style={{ position: "relative", marginTop: 30 }}>
          <Kinetic text={host} from={18} size={portrait ? 150 : 200} style={{ textAlign: "center" }} />
          <Pen
            d={PEN_PATHS.circle}
            from={40}
            duration={22}
            width={7}
            w={portrait ? 1000 : 1300}
            h={portrait ? 300 : 360}
            style={{ left: "50%", top: "50%", marginLeft: portrait ? -500 : -650, marginTop: portrait ? -150 : -170 }}
          />
        </div>
        <div style={{ marginTop: 70, fontSize: portrait ? 30 : 32, letterSpacing: "0.08em", textAlign: "center" }}>
          <Typewriter text={`github/${SOCIALS.github.split("/").pop()}  ·  x/@${handle}`} from={70} cps={40} />
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 70,
            fontFamily: F.mono,
            fontSize: 20,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: C.inkFaint,
            opacity: interpolate(frame, [100, 115], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          Made with Remotion · cut like a Vox explainer
        </div>
      </AbsoluteFill>
    </Paper>
  );
}
