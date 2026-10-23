import { useVideoConfig } from "remotion";

/** Scenes are art-directed for 16:9 and re-flow for 9:16. */
export function useLayout() {
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const portrait = height > width;
  return { width, height, fps, durationInFrames, portrait, pad: portrait ? 72 : 120 };
}
