// Frame counts for every scene, kept free of imports so the website can read
// the explainer's length without pulling the video bundle (fonts and all).

export const FPS = 30;

export const COLD_OPEN_FRAMES = 240;
export const MACGET_FRAMES = 420;
export const CASE_FILES_FRAMES = 420;
export const STACK_FRAMES = 300;
export const TIMELINE_FRAMES = 360;
export const RECEIPTS_FRAMES = 300;
export const CTA_FRAMES = 180;

/** Length of each page-turn cut between scenes. */
export const TRANSITION_FRAMES = 16;

const SCENE_FRAMES = [COLD_OPEN_FRAMES, MACGET_FRAMES, CASE_FILES_FRAMES, STACK_FRAMES, TIMELINE_FRAMES, RECEIPTS_FRAMES, CTA_FRAMES];

export const EXPLAINER_FRAMES = SCENE_FRAMES.reduce((a, b) => a + b, 0) - TRANSITION_FRAMES * (SCENE_FRAMES.length - 1);
