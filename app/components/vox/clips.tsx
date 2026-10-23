"use client";

// Every Remotion scene the site embeds, behind one lazy boundary. This module
// (and the whole video/ tree, fonts included) is only fetched by the browser
// when a clip scrolls near the viewport — see RemotionClip.
import { Player, type PlayerRef } from "@remotion/player";
import type { RefObject } from "react";
import { EXPLAINER_FRAMES, PortfolioExplainer } from "@/video/explainer";
import { COLD_OPEN_FRAMES, ColdOpen } from "@/video/scenes/cold-open";
import { MACGET_FRAMES, MacGet, type ProofStats } from "@/video/scenes/macget";
import { TIMELINE_FRAMES, Timeline } from "@/video/scenes/timeline";
import { FPS } from "@/video/theme";

export type ClipId = "cold-open" | "macget" | "timeline" | "explainer";

const MacGetClip = (p: ProofStats) => <MacGet stats={p} />;

const CLIPS = {
  "cold-open": { component: ColdOpen, frames: COLD_OPEN_FRAMES },
  macget: { component: MacGetClip, frames: MACGET_FRAMES },
  timeline: { component: Timeline, frames: TIMELINE_FRAMES },
  explainer: { component: PortfolioExplainer, frames: EXPLAINER_FRAMES },
} as const;

export type ClipPlayerProps = {
  id: ClipId;
  stats?: ProofStats;
  controls?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  /** Fill a sized parent (letterboxed) instead of sizing itself at 16:9. */
  fill?: boolean;
  /** Passed as a prop because next/dynamic doesn't forward refs. */
  playerRef?: RefObject<PlayerRef>;
};

export default function ClipPlayer({
  id,
  stats = { githubStars: 0, macgetDownloads: 0 },
  controls = false,
  autoPlay = true,
  loop = true,
  fill = false,
  playerRef,
}: ClipPlayerProps) {
  const clip = CLIPS[id];
  return (
    <Player
      ref={playerRef}
      component={clip.component as React.ComponentType<Record<string, unknown>>}
      inputProps={stats}
      durationInFrames={clip.frames}
      fps={FPS}
      compositionWidth={1920}
      compositionHeight={1080}
      style={fill ? { width: "100%", height: "100%" } : { width: "100%", aspectRatio: "16 / 9" }}
      controls={controls}
      autoPlay={autoPlay}
      // browsers only allow muted autoplay; the clips have no audio anyway
      initiallyMuted={!controls}
      loop={loop}
      clickToPlay={controls}
      acknowledgeRemotionLicense
    />
  );
}
