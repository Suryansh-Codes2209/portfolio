// The video's palette mirrors the light "Newsprint" tokens in global.css.
// Remotion renders with inline styles only (no Tailwind), so these are the
// single source for every scene.
import { loadFont as loadSerif } from "@remotion/google-fonts/InstrumentSerif";
import { loadFont as loadSans } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

export const C = {
  paper: "#f2ecdf",
  paper2: "#ebe3d2",
  sheet: "#faf6ee",
  ink: "#1a1714",
  inkMuted: "#4a443c",
  inkFaint: "#978d7e",
  pen: "#c15f3c",
  highlight: "#ffe14d",
  tape: "rgba(233, 223, 199, 0.9)",
  line: "rgba(26, 23, 20, 0.16)",
  board: "#c9a97a",
  sticky: { yellow: "#fff3b0", pink: "#ffd9cf", blue: "#d8e8f0" },
} as const;

const serif = loadSerif("normal", { weights: ["400"], subsets: ["latin"] });
const sans = loadSans("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });
const mono = loadMono("normal", { weights: ["400", "700"], subsets: ["latin"] });

export const F = {
  serif: serif.fontFamily,
  sans: sans.fontFamily,
  mono: mono.fontFamily,
} as const;

export { FPS } from "./durations";
import { FPS } from "./durations";

/** Seconds → frames. */
export const s = (sec: number) => Math.round(sec * FPS);

/** Stable pseudo-random number in [-1, 1] from a string — same every render. */
export function jitter(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return ((Math.abs(h) % 1000) / 1000) * 2 - 1;
}
