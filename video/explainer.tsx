import { linearTiming, type TransitionPresentation, TransitionSeries } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { Audio, staticFile } from "remotion";
import { EXPLAINER_FRAMES, TRANSITION_FRAMES } from "./durations";
import { CASE_FILES_FRAMES, CaseFiles } from "./scenes/case-files";
import { COLD_OPEN_FRAMES, ColdOpen } from "./scenes/cold-open";
import { CTA_FRAMES, Cta } from "./scenes/cta";
import { MACGET_FRAMES, MacGet, type ProofStats } from "./scenes/macget";
import { RECEIPTS_FRAMES, Receipts } from "./scenes/receipts";
import { STACK_FRAMES, Stack } from "./scenes/stack";
import { TIMELINE_FRAMES, Timeline } from "./scenes/timeline";

export type ExplainerProps = ProofStats & { withMusic?: boolean };

const T = TRANSITION_FRAMES;

// Page-turn feel: sheets slide over each other, alternating with a wipe like
// a sheet being pulled away.
const CUTS: TransitionPresentation<any>[] = [
  slide({ direction: "from-right" }),
  wipe({ direction: "from-left" }),
  slide({ direction: "from-bottom" }),
  wipe({ direction: "from-top-left" }),
  slide({ direction: "from-right" }),
  wipe({ direction: "from-left" }),
];

const SCENES = [
  { frames: COLD_OPEN_FRAMES, render: () => <ColdOpen /> },
  { frames: MACGET_FRAMES, render: (p: ExplainerProps) => <MacGet stats={p} /> },
  { frames: CASE_FILES_FRAMES, render: () => <CaseFiles /> },
  { frames: STACK_FRAMES, render: () => <Stack /> },
  { frames: TIMELINE_FRAMES, render: () => <Timeline /> },
  { frames: RECEIPTS_FRAMES, render: () => <Receipts /> },
  { frames: CTA_FRAMES, render: () => <Cta /> },
];

export { EXPLAINER_FRAMES };

/** The whole thing: seven chapters, page-turn cuts, optional music bed. */
export function PortfolioExplainer(props: ExplainerProps) {
  return (
    <>
      <TransitionSeries>
        {SCENES.flatMap((sc, i) => {
          const seq = (
            <TransitionSeries.Sequence key={`s${i}`} durationInFrames={sc.frames}>
              {sc.render(props)}
            </TransitionSeries.Sequence>
          );
          return i === 0
            ? [seq]
            : [<TransitionSeries.Transition key={`t${i}`} presentation={CUTS[i - 1]} timing={linearTiming({ durationInFrames: T })} />, seq];
        })}
      </TransitionSeries>
      {/* Drop a track at public/video/music.mp3 and render with --props='{"withMusic":true}' */}
      {props.withMusic && <Audio src={staticFile("video/music.mp3")} volume={(f: number) => Math.min(1, f / 30) * 0.6} />}
    </>
  );
}
