import { COLD_OPEN_FRAMES } from "../durations";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Caption } from "../primitives/caption";
import { Drop } from "../primitives/drop";
import { Kinetic } from "../primitives/kinetic";
import { useLayout } from "../primitives/layout";
import { Paper } from "../primitives/paper";
import { PEN_PATHS, Pen } from "../primitives/pen";
import { Stamp } from "../primitives/stamp";
import { Tape } from "../primitives/tape";
import { Typewriter } from "../primitives/typewriter";
import { C } from "../theme";

export { COLD_OPEN_FRAMES };

const STICKER =
  "drop-shadow(0 0 0 #fff) drop-shadow(6px 0 0 #fff) drop-shadow(-6px 0 0 #fff) drop-shadow(0 6px 0 #fff) drop-shadow(0 -6px 0 #fff)";

/** Ch.0 — "Who is Suryansh Chaudhary?" The subject file opens. */
export function ColdOpen() {
  const frame = useCurrentFrame();
  const { portrait, pad, durationInFrames } = useLayout();
  const push = interpolate(frame, [0, durationInFrames], [1, 1.06]);

  const photoW = portrait ? 1250 : 1150;

  return (
    <Paper>
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
        <Caption from={2} style={{ position: "absolute", top: 64, left: pad }}>
          <span style={{ color: C.pen }}>FIG. 01</span> — Subject file
        </Caption>

        {/* the subject, cut out and taped down */}
        <Drop
          from={26}
          rotate={portrait ? 2 : 3}
          dy={-260}
          style={portrait ? { left: -85, bottom: -40, width: photoW } : { right: -110, bottom: -120, width: photoW }}
        >
          <Img src={staticFile("hero-portrait-vector.png")} style={{ width: "100%", filter: STICKER }} />
          <Tape width={190} rotate={-6} style={{ left: "44%", top: 40 }} />
        </Drop>

        <div
          style={{
            position: "absolute",
            left: pad,
            top: portrait ? 200 : 250,
            width: portrait ? 940 : 880,
          }}
        >
          <Kinetic text="Who is" from={8} size={portrait ? 96 : 84} style={{ color: C.inkMuted, fontStyle: "italic" }} />
          <Kinetic text="Suryansh Chaudhary?" from={16} stagger={5} size={portrait ? 170 : 168} mark={["Chaudhary?"]} />
          <div style={{ marginTop: 48, fontSize: portrait ? 38 : 34 }}>
            <Typewriter text={"Full-Stack AI Engineer.\nShips software in public."} from={70} />
          </div>
        </div>

        {/* pen arrow from the copy to the photo */}
        {!portrait && <Pen d={PEN_PATHS.arrow} w={240} h={110} from={118} duration={16} style={{ left: 740, top: 700 }} />}

        <Stamp from={150} rotate={-7} style={portrait ? { left: pad + 300, top: 120 } : { left: pad + 360, top: 930 }}>
          Builds in public
        </Stamp>
      </AbsoluteFill>
    </Paper>
  );
}
