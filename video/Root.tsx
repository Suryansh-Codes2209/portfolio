import { Composition, Folder } from "remotion";
import { getProofStats } from "../app/data/stats";
import { EXPLAINER_FRAMES, type ExplainerProps, PortfolioExplainer } from "./explainer";
import { CASE_FILES_FRAMES, CaseFiles } from "./scenes/case-files";
import { COLD_OPEN_FRAMES, ColdOpen } from "./scenes/cold-open";
import { CTA_FRAMES, Cta } from "./scenes/cta";
import { MACGET_FRAMES, MacGet, type ProofStats } from "./scenes/macget";
import { RECEIPTS_FRAMES, Receipts } from "./scenes/receipts";
import { STACK_FRAMES, Stack } from "./scenes/stack";
import { TIMELINE_FRAMES, Timeline } from "./scenes/timeline";
import { FPS } from "./theme";

const ZERO: ProofStats = { githubStars: 0, macgetDownloads: 0 };

// Fill real GitHub numbers at render time. getProofStats never throws — a
// rate-limited fetch just renders the "Free. Open source." fallback note.
const withStats = async ({ props }: { props: Record<string, unknown> }) => ({
  props: { ...props, ...(await getProofStats()) },
});

const MacGetScene = (p: ProofStats) => <MacGet stats={p} />;

const SIZES = [
  { id: "", width: 1920, height: 1080 },
  { id: "Vertical", width: 1080, height: 1920 },
];

export function RemotionRoot() {
  return (
    <>
      {SIZES.map(({ id, width, height }) => (
        <Folder key={id || "Landscape"} name={id || "Landscape"}>
          <Composition
            id={`PortfolioExplainer${id}`}
            component={PortfolioExplainer}
            durationInFrames={EXPLAINER_FRAMES}
            fps={FPS}
            width={width}
            height={height}
            defaultProps={{ ...ZERO, withMusic: false } as ExplainerProps}
            calculateMetadata={withStats}
          />
          <Composition id={`ColdOpen${id}`} component={ColdOpen} durationInFrames={COLD_OPEN_FRAMES} fps={FPS} width={width} height={height} />
          <Composition
            id={`MacGet${id}`}
            component={MacGetScene}
            durationInFrames={MACGET_FRAMES}
            fps={FPS}
            width={width}
            height={height}
            defaultProps={ZERO}
            calculateMetadata={withStats}
          />
          <Composition id={`CaseFiles${id}`} component={CaseFiles} durationInFrames={CASE_FILES_FRAMES} fps={FPS} width={width} height={height} />
          <Composition id={`Stack${id}`} component={Stack} durationInFrames={STACK_FRAMES} fps={FPS} width={width} height={height} />
          <Composition id={`Timeline${id}`} component={Timeline} durationInFrames={TIMELINE_FRAMES} fps={FPS} width={width} height={height} />
          <Composition id={`Receipts${id}`} component={Receipts} durationInFrames={RECEIPTS_FRAMES} fps={FPS} width={width} height={height} />
          <Composition id={`Cta${id}`} component={Cta} durationInFrames={CTA_FRAMES} fps={FPS} width={width} height={height} />
        </Folder>
      ))}
    </>
  );
}
