import { EXPLAINER_FRAMES, FPS } from "@/video/durations";

// Read from the video's own frame counts so the button copy can't drift from
// the real cut. durations.ts has no imports, so this stays out of the lazy
// video bundle.
export const EXPLAINER_SECONDS = Math.round(EXPLAINER_FRAMES / FPS);
