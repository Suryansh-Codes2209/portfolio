# Portfolio Redesign + Blog/SEO Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the portfolio into a professional build-in-public presence — remove dated gimmicks, ship a full editorial+bento visual overhaul with a token system, a proof-driven hero, and complete the blog/SEO engine (dynamic OG, Article JSON-LD, RSS, llms.txt).

**Architecture:** Single Next.js 14 App Router codebase. `app/page.tsx` (currently ~900 lines) is decomposed: hero, `#now` bento, and section data are extracted into focused components under `app/components/`. A CSS-variable design-token layer in `app/global.css` becomes the single source of truth for color; a monospace font is added via `next/font`. Build-time proof stats (GitHub stars, MacGet downloads) fetch in one helper with static fallbacks. Blog SEO gaps are filled additively (existing metadata baseline is kept).

**Tech Stack:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS 3.4, Framer Motion 10, Contentlayer2, `next/font`, `next/og` (ImageResponse), lucide-react.

## Global Constraints

- **No test framework exists.** Verification = `pnpm build` green + route 200 checks + explicit visual acceptance. Never claim "tests pass."
- **Indentation:** New/edited TS/TSX files use **2-space indent, NOT Rome tabs** (project memory gotcha). Do NOT run `pnpm fmt` on new component files (it retabs). Existing tab-indented files (`sitemap.ts`, `robots.ts`, `tailwind.config.js`, `contentlayer.config.js`) keep tabs when edited.
- **Blog domain:** all canonical URLs stay `https://suryansh.work/...`. No subdomain routing.
- **Accent color:** keep the `claude` orange scale (`#D97757` = `claude-500`). Accent is intentional, not everywhere.
- **Motion:** honor `prefers-reduced-motion` on every animated element. No new decorative motion.
- **Node/Next:** Next `^14.2.24`, React `^18.3.1`, Tailwind `^3.4.17` — do not bump majors.
- **Commit style:** conventional commits (`feat:`, `refactor:`, `chore:`, `docs:`). Frequent, per-task.
- **Branch:** `redesign/portfolio-2026` (already created; spec committed there).
- **Hero defaults (approved):** full "Suryansh Chaudhary" as giant display type + small avatar accent (hybrid); monospace = **JetBrains Mono**.

---

## File Structure

**Create:**
- `app/components/hero.tsx` — the rebuilt hero section (client component).
- `app/components/now-bento.tsx` — bento grid for the `#now` section (client component).
- `app/data/stats.ts` — build-time proof-stats fetcher (GitHub stars, MacGet downloads) with fallbacks.
- `app/blog/[slug]/opengraph-image.tsx` — dynamic per-post 1200×630 OG card via `next/og`.
- `app/rss.xml/route.ts` — RSS feed route generated from `allBlogs`.
- `public/llms.txt` — static AI-crawler summary.
- `public/fonts/` JetBrains Mono files (or via `next/font/google`).

**Modify:**
- `app/global.css` — design tokens + grain overlay + reduced-motion baseline.
- `tailwind.config.js` — `font-mono` family, semantic token colors.
- `app/layout.tsx` — wire mono font variable, grain overlay, RSS `<link>` alternate.
- `app/page.tsx` — remove `GestureScroll`, import extracted `Hero`/`NowBento`, restyle sections to tokens.
- `app/components/hero-intro.tsx` — strip Web Audio; keep silent flash; add skip affordance.
- `app/blog/[slug]/page.tsx` — add `Article` JSON-LD; use generated OG image.
- `CLAUDE.md` — remove fahhh/Web-Audio + gesture-scroll docs; document new pieces.
- `package.json` — drop `@mediapipe/tasks-vision`.

**Delete:**
- `app/components/gesture-scroll.tsx`
- `public/sounds/fahhh.mp3`, `public/sounds/fuckyou.mp3` (and `public/sounds/` if empty)

---

## Task 1: Remove hand-scroll / MediaPipe gimmick

**Files:**
- Delete: `app/components/gesture-scroll.tsx`, `public/sounds/fuckyou.mp3`
- Modify: `app/page.tsx` (remove import line 18 + usage line 224), `package.json`

**Interfaces:**
- Produces: nothing consumed downstream. Removes the `<GestureScroll />` node from the nav.

- [ ] **Step 1: Remove the usage in `app/page.tsx`**

Delete the import on line 18:
```tsx
import { GestureScroll } from "./components/gesture-scroll";
```
Delete the usage in the nav (around line 224):
```tsx
<GestureScroll className="hidden sm:flex" />
```

- [ ] **Step 2: Delete the component and its sound**

```bash
git rm app/components/gesture-scroll.tsx public/sounds/fuckyou.mp3
```

- [ ] **Step 3: Remove the dependency**

Edit `package.json`, delete the line:
```json
"@mediapipe/tasks-vision": "^0.10.35",
```
Then:
```bash
pnpm install
```

- [ ] **Step 4: Verify it's gone from the tree**

Run: `pnpm why @mediapipe/tasks-vision || echo "REMOVED"`
Expected: prints `REMOVED` (or "No packages found").

Run: `grep -rn "gesture-scroll\|GestureScroll\|mediapipe" app/ package.json`
Expected: no matches.

- [ ] **Step 5: Build**

Run: `pnpm build`
Expected: build succeeds, no missing-module errors.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: remove MediaPipe hand-scroll gimmick and its dependency"
```

---

## Task 2: Strip the fahhh boom sound from the intro (keep silent flash + add skip)

**Files:**
- Modify: `app/components/hero-intro.tsx`
- Delete: `public/sounds/fahhh.mp3` (and `public/sounds/` dir — now empty)

**Interfaces:**
- Consumes: nothing new.
- Produces: `HeroIntro` still renders the terminal + boom **flash** (visual), now silent, fast, and skippable via a "skip" button or any keypress/click.

- [ ] **Step 1: Remove all Web Audio code**

In `app/components/hero-intro.tsx`, delete:
- The refs `audioCtxRef`, `bufferRef`, `primedRef` (lines ~54-56).
- The entire audio setup `useEffect` body that creates `AudioCtx`, fetches/decodes `fahhh.mp3`, and registers the `unlock` gesture listeners (lines ~81-113). Keep the parts of that effect that set `mounted`, read `sessionStorage`, and set `active`/`done`.
- Inside the sequence `run()`, delete the audio playback block that reads `audioCtxRef`/`bufferRef` and calls `src.start(0)` (lines ~173-184). Keep `setFlash(true)`.

The mount effect should reduce to:
```tsx
useEffect(() => {
  setMounted(true);
  if (typeof window === "undefined") return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const seen = sessionStorage.getItem(STORAGE_KEY) === "1";
  if (reduced || seen) {
    setDone(true);
    return;
  }
  setActive(true);
}, []);
```

- [ ] **Step 2: Add a skip affordance**

Add a `skip` helper inside the component and wire it to a button + global keydown/click:
```tsx
const skip = useCallback(() => {
  sessionStorage.setItem(STORAGE_KEY, "1");
  setActive(false);
  setDone(true);
}, []);

useEffect(() => {
  if (!active || done) return;
  const onKey = () => skip();
  window.addEventListener("keydown", onKey, { once: true });
  return () => window.removeEventListener("keydown", onKey);
}, [active, done, skip]);
```
Add a visible skip button inside the intro overlay (near the bottom-right label):
```tsx
<button
  onClick={skip}
  className="pointer-events-auto absolute bottom-6 right-6 text-[10px] uppercase tracking-[0.3em] text-zinc-600 hover:text-zinc-300 transition-colors"
>
  skip →
</button>
```
(Replace the existing static "Suryansh · 2026" corner label, or move it left.)

Import `useCallback` from React if not already imported.

- [ ] **Step 3: Speed up the sequence**

Reduce the delays in `run()` so the whole intro finishes in well under ~4s: typing `delay(34)` → `delay(22)`; per-step `delay(260)` → `delay(160)`; opening `delay(600)` → `delay(300)`. Keep the boom `setFlash(true)` and the final `delay(680)` reveal.

- [ ] **Step 4: Delete the sound file**

```bash
git rm public/sounds/fahhh.mp3
rmdir public/sounds 2>/dev/null || true
```

- [ ] **Step 5: Verify no audio references remain**

Run: `grep -rn "AudioContext\|fahhh\|decodeAudioData\|webkitAudioContext" app/`
Expected: no matches.

Run: `pnpm build`
Expected: succeeds.

- [ ] **Step 6: Manual check**

Run `pnpm dev`, open `/` in a fresh tab (or clear sessionStorage). Expect: terminal types fast, streams log, silent orange flash, reveals site in <4s; "skip →" button and any keypress end it immediately; reload in same session does NOT replay.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: remove fahhh boom sound; make intro fast and skippable"
```

---

## Task 3: Design tokens + monospace font + grain

**Files:**
- Modify: `app/global.css`, `tailwind.config.js`, `app/layout.tsx`

**Interfaces:**
- Produces: CSS vars `--bg --surface --surface-2 --border --text --text-muted --text-faint --accent`; Tailwind `font-mono` (JetBrains Mono via `--font-mono`); a `.grain` overlay utility. Later tasks reference `font-mono` and these tokens.

- [ ] **Step 1: Add the mono font in `app/layout.tsx`**

Add alongside the existing Inter import:
```tsx
import { Inter, JetBrains_Mono } from "next/font/google";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});
```
Add its variable to the `<html>` className:
```tsx
<html lang="en" className={[inter.variable, calSans.variable, jetbrainsMono.variable].join(" ")}>
```

- [ ] **Step 2: Register `font-mono` in `tailwind.config.js`**

In `theme.extend.fontFamily`, add (keep tabs — this file uses tabs):
```js
mono: ["var(--font-mono)", ...defaultTheme.fontFamily.mono],
```

- [ ] **Step 3: Add semantic token colors in `tailwind.config.js`**

In `theme.extend.colors`, alongside `claude`, add:
```js
bg: "var(--bg)",
surface: "var(--surface)",
"surface-2": "var(--surface-2)",
line: "var(--border)",
```
(Named `line` to avoid clashing with Tailwind's `border-*`.)

- [ ] **Step 4: Define tokens + grain in `app/global.css`**

At the top of `app/global.css` (after any `@tailwind` directives), add:
```css
:root {
  --bg: #08070a;
  --surface: rgba(24, 22, 27, 0.55);
  --surface-2: rgba(32, 29, 35, 0.7);
  --border: rgba(120, 113, 108, 0.14);
  --text: #f5f4f2;
  --text-muted: #a1a1aa;
  --text-faint: #6b6b73;
  --accent: #d97757;
}

/* subtle film grain — premium editorial feel */
.grain::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  opacity: 0.035;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 5: Apply grain at the root**

In `app/layout.tsx`, add the `grain` class to `<body>`:
```tsx
<body className={`grain bg-black ${process.env.NODE_ENV === "development" ? "debug-screens" : undefined}`}>
```

- [ ] **Step 6: Verify**

Run: `pnpm build`
Expected: succeeds.
Run `pnpm dev`; confirm a faint grain texture over the page and that `font-mono` resolves (temporarily add `className="font-mono"` to a heading, see JetBrains Mono, then revert).

- [ ] **Step 7: Commit**

```bash
git add app/global.css tailwind.config.js app/layout.tsx
git commit -m "feat: add design tokens, JetBrains Mono, and film-grain overlay"
```

---

## Task 4: Build-time proof stats helper

**Files:**
- Create: `app/data/stats.ts`

**Interfaces:**
- Produces: `export async function getProofStats(): Promise<{ githubStars: number; macgetDownloads: number }>` — fetched at build with a 24h revalidate and static fallbacks. Consumed by Task 5 (Hero).

- [ ] **Step 1: Write the helper**

Create `app/data/stats.ts`:
```ts
// Build-time proof stats for the hero. Never throws — falls back to static
// numbers so a failed/ratelimited fetch can't break the build or the hero.
const FALLBACK = { githubStars: 0, macgetDownloads: 0 };

type Stats = { githubStars: number; macgetDownloads: number };

async function safeJson(url: string): Promise<any | null> {
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/vnd.github+json", "User-Agent": "suryansh-portfolio" },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function getProofStats(): Promise<Stats> {
  const [repo, releases] = await Promise.all([
    safeJson("https://api.github.com/repos/Suryansh-Codes2209/Macget"),
    safeJson("https://api.github.com/repos/Suryansh-Codes2209/Macget/releases"),
  ]);

  const githubStars = typeof repo?.stargazers_count === "number" ? repo.stargazers_count : FALLBACK.githubStars;

  let macgetDownloads = FALLBACK.macgetDownloads;
  if (Array.isArray(releases)) {
    macgetDownloads = releases.reduce((sum: number, r: any) => {
      const assets = Array.isArray(r?.assets) ? r.assets : [];
      return sum + assets.reduce((s: number, a: any) => s + (a?.download_count ?? 0), 0);
    }, 0);
  }

  return { githubStars, macgetDownloads };
}

// Compact display: 1234 -> "1.2k"
export function compact(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, "")}k`;
  return String(n);
}
```

- [ ] **Step 2: Type-check**

Run: `pnpm build`
Expected: succeeds (helper is unused so far — that's fine; Next tree-shakes it).

- [ ] **Step 3: Commit**

```bash
git add app/data/stats.ts
git commit -m "feat: add build-time GitHub/MacGet proof-stats helper"
```

---

## Task 5: Rebuild the hero as a proof-driven component

**Files:**
- Create: `app/components/hero.tsx`
- Modify: `app/page.tsx` (replace the inline `<section>` hero, lines ~272-368, with `<Hero stats={stats} />`; make `Home` an async server wrapper OR pass stats via a server parent — see Step 4)

**Interfaces:**
- Consumes: `getProofStats`, `compact` from `app/data/stats.ts`; `roles`/`socials` currently defined inline in `page.tsx`.
- Produces: `export function Hero({ stats }: { stats: { githubStars: number; macgetDownloads: number } })`.

**Note on data flow:** `app/page.tsx` is currently `"use client"`. To fetch stats at build we need a server boundary. Approach: keep `page.tsx` a client component for its interactivity, but create a thin **server** wrapper is overkill — instead fetch stats in a small server component. Simplest correct move: convert the hero's *data* to load in `app/page.tsx` by making the **page** a server component is a large refactor. **Chosen approach:** create `app/components/hero.tsx` as a **client** component that receives `stats` as props, and fetch `stats` in a new server component `app/hero-data.tsx`… (avoid over-engineering) →

**Chosen approach (final):** Since `page.tsx` must stay client for the contact form/typing, fetch stats in the **`Hero` is client but stats come from the server** via a tiny server component. Implement `app/components/hero-server.tsx` (server) that calls `getProofStats()` and renders `<Hero stats={stats} />`. `page.tsx` imports and renders `<HeroServer />`. Client boundary preserved; stats resolved at build.

- [ ] **Step 1: Create the client `Hero` component**

Create `app/components/hero.tsx`:
```tsx
"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, Download, Github, Linkedin, Mail, Twitter } from "lucide-react";
import Image from "next/image";
import { compact } from "../data/stats";

const rail = [
  { icon: <Github className="w-4 h-4" />, href: "https://github.com/Suryansh-Codes2209", label: "GitHub" },
  { icon: <Twitter className="w-4 h-4" />, href: "https://x.com/Suryansh_2001", label: "X" },
  { icon: <Linkedin className="w-4 h-4" />, href: "https://www.linkedin.com/in/suryansh-chaudhary-2209/", label: "LinkedIn" },
  { icon: <Mail className="w-4 h-4" />, href: "mailto:suryansh.codes2001@gmail.com", label: "Email" },
];

export function Hero({ stats }: { stats: { githubStars: number; macgetDownloads: number } }) {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-dvh text-center px-4 pt-14 overflow-hidden">
      {/* restrained ambient glow — ONE orb, not five */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[520px] h-80 rounded-full bg-claude-600/10 blur-[110px] pointer-events-none" />

      {/* vertical social rail (desktop) */}
      <div className="hidden lg:flex flex-col items-center gap-4 absolute right-8 top-1/2 -translate-y-1/2">
        {rail.map((s) => (
          <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
             className="text-zinc-600 hover:text-claude-300 transition-colors">{s.icon}</a>
        ))}
        <span className="w-px h-16 bg-line mt-2" />
      </div>

      {/* availability pill */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, duration: 0.4 }}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-claude-500/30 bg-claude-500/10 mb-8 font-mono text-[11px] tracking-wide text-claude-300">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-claude-300 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-claude-500" />
        </span>
        Available for work · Building in public
      </motion.div>

      {/* small avatar accent */}
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
        className="mb-6">
        <div className="w-16 h-16 rounded-full ring-1 ring-claude-500/40 ring-offset-2 ring-offset-black overflow-hidden mx-auto">
          <Image src="/Profile.png" alt="Suryansh Chaudhary" width={64} height={64} className="object-cover w-full h-full" priority />
        </div>
      </motion.div>

      {/* OVERSIZED name */}
      <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.55 }}
        className="font-display leading-[0.95] tracking-tight text-transparent bg-white bg-clip-text text-edge-outline
                   text-[15vw] sm:text-[13vw] lg:text-[9.5rem] mb-5">
        Suryansh<br className="sm:hidden" /> Chaudhary
      </motion.h1>

      {/* one-line ship-focused tagline */}
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28, duration: 0.4 }}
        className="text-base sm:text-lg text-zinc-400 max-w-xl mb-8">
        I build in public — shipping <span className="text-zinc-200">MacGet</span> and production AI systems.
      </motion.p>

      {/* CTAs — one primary */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.45 }}
        className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
        <a href="#contact" className="px-6 py-2.5 rounded-full bg-claude-600 text-white text-sm font-medium hover:bg-claude-500 transition-colors shadow-[0_0_20px_rgba(217,119,87,0.35)]">
          Let&apos;s build something
        </a>
        <a href="#projects" className="px-6 py-2.5 rounded-full border border-line text-zinc-300 text-sm hover:border-zinc-500 hover:text-white transition-colors">
          View work
        </a>
      </motion.div>

      {/* REAL proof row */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55, duration: 0.4 }}
        className="flex items-center gap-8 font-mono text-xs text-zinc-500">
        <span className="flex items-center gap-1.5"><Github className="w-3.5 h-3.5 text-claude-400" /> {compact(stats.githubStars)} stars</span>
        <span className="w-px h-4 bg-line" />
        <span className="flex items-center gap-1.5"><Download className="w-3.5 h-3.5 text-claude-400" /> {compact(stats.macgetDownloads)} downloads</span>
        <span className="w-px h-4 bg-line hidden sm:block" />
        <a href="/suryansh.pdf" download className="hidden sm:flex items-center gap-1.5 hover:text-zinc-200 transition-colors">
          <Download className="w-3.5 h-3.5" /> Resume
        </a>
      </motion.div>

      <a href="#now" aria-label="Scroll" className="absolute bottom-8 text-zinc-700 hover:text-zinc-400 transition-colors">
        <ArrowDown className="w-5 h-5 animate-bounce" />
      </a>
    </section>
  );
}
```
Note: `text-edge-outline` and `/Profile.png` already exist in the project.

- [ ] **Step 2: Create the server wrapper**

Create `app/components/hero-server.tsx`:
```tsx
import { getProofStats } from "../data/stats";
import { Hero } from "./hero";

export async function HeroServer() {
  const stats = await getProofStats();
  return <Hero stats={stats} />;
}
```

- [ ] **Step 3: Wire into `app/page.tsx`**

Add import:
```tsx
import { HeroServer } from "./components/hero-server";
```
Replace the entire inline hero `<section className="relative flex flex-col items-center justify-center min-h-dvh ...">…</section>` (the block starting ~line 273 and ending ~line 368) with:
```tsx
{/* @ts-expect-error Async Server Component rendered from a client tree */}
<HeroServer />
```
Remove the now-unused hero-only imports/vars if they become dead (`Particles` if only used in hero, the `role`/`useTyping` if you drop the typing line — keep `useTyping`/`roles` only if still referenced elsewhere; otherwise delete to avoid lint errors).

**Important:** A client component (`page.tsx` has `"use client"`) cannot directly render an async server component as a child in all setups. If `pnpm build` errors on this boundary, fall back to: make `HeroServer`'s stats fetch happen in `app/page.tsx`'s parent by converting the hero to fetch client-side in a `useEffect` with the same `getProofStats` logic moved to an API route `app/api/stats/route.ts`. Prefer the server-component approach first; only fall back if the build rejects it.

- [ ] **Step 4: Build + verify**

Run: `pnpm build`
Expected: succeeds. If it fails on the async-in-client boundary, apply the fallback in Step 3.

Run `pnpm dev`; confirm: giant name, availability pill, small avatar, one primary CTA, vertical social rail (desktop), and a proof row showing real numbers (or `0 stars / 0 downloads` fallback if the repo is private/ratelimited — acceptable).

- [ ] **Step 5: Commit**

```bash
git add app/components/hero.tsx app/components/hero-server.tsx app/page.tsx
git commit -m "feat: rebuild hero — oversized name, availability pill, real proof row"
```

---

## Task 6: Convert `#now` to a bento grid

**Files:**
- Create: `app/components/now-bento.tsx`
- Modify: `app/page.tsx` (replace the `#now` section's inner 3-card grid with `<NowBento />`)

**Interfaces:**
- Produces: `export function NowBento()` — self-contained bento with the same three "now" items, varied tile sizes.

- [ ] **Step 1: Create the bento component**

Create `app/components/now-bento.tsx`:
```tsx
"use client";

import { motion } from "framer-motion";
import { Code2, Cpu, Zap } from "lucide-react";

const items = [
  { icon: <Zap className="w-4 h-4 text-claude-400" />, title: "Shipping MacGet 1.2", desc: "YouTube & HLS video downloads, browser-capture, and signed auto-updates for the macOS download manager.", span: "sm:col-span-2 sm:row-span-2" },
  { icon: <Code2 className="w-4 h-4 text-claude-300" />, title: "Writing build logs", desc: "Documenting how the download engine, actor concurrency, and AI agents actually get built — in public.", span: "" },
  { icon: <Cpu className="w-4 h-4 text-claude-400" />, title: "AI agents in production", desc: "Financial research agents at Spiral Kite Labs — live market data, grounded reasoning, analyst-grade reports.", span: "" },
];

export function NowBento() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 auto-rows-[minmax(140px,auto)]">
      {items.map((item, i) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45, delay: i * 0.07 }}
          className={`p-6 rounded-2xl border border-line bg-surface hover:border-claude-500/30 transition-colors flex flex-col ${item.span}`}
        >
          <div className="mb-3">{item.icon}</div>
          <h3 className={`font-medium text-zinc-200 mb-1.5 ${item.span ? "text-lg" : "text-sm"}`}>{item.title}</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">{item.desc}</p>
        </motion.div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Wire into `app/page.tsx`**

Add `import { NowBento } from "./components/now-bento";`. In the `#now` section, replace the existing `<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">…</div>` (the block mapping the three inline items, ~lines 388-404) with:
```tsx
<NowBento />
```
Remove the now-dead inline `items` array in that section.

- [ ] **Step 3: Build + verify**

Run: `pnpm build` → succeeds.
`pnpm dev`: `#now` shows a bento layout — MacGet tile dominant (2×2), two smaller tiles.

- [ ] **Step 4: Commit**

```bash
git add app/components/now-bento.tsx app/page.tsx
git commit -m "feat: convert #now section to a bento grid"
```

---

## Task 7: Restyle sections to tokens + monospace eyebrows

**Files:**
- Modify: `app/page.tsx`

**Interfaces:** none new. Cosmetic pass aligning existing sections to the token system.

- [ ] **Step 1: Monospace + token eyebrows**

For each section eyebrow (the `<motion.p>` with `text-[10px] uppercase tracking-widest text-zinc-600`), add `font-mono` and standardize to `text-claude-400/70`. Example replacement pattern (apply to About, Stack, Projects, Recommendation, Blog, Contact eyebrows):
```tsx
className="font-mono text-[10px] uppercase tracking-[0.25em] text-claude-400/70 mb-2"
```

- [ ] **Step 2: Trim redundant blur orbs**

In each section, keep at most **one** decorative blur-orb `<div>`; delete the extras (each section currently has 2). This is a perf + focus win.

- [ ] **Step 3: Swap card borders/surfaces to tokens**

Replace ad-hoc `border-zinc-800/70 bg-zinc-900/30` on cards with `border-line bg-surface` for consistency (About stat cards, About feature cards, Stack chips container as appropriate). Leave the `Card` component as-is unless trivial.

- [ ] **Step 4: Build + verify**

Run: `pnpm build` → succeeds.
`pnpm dev`: eyebrows are monospace, spacing consistent, backgrounds calmer.

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx
git commit -m "style: align sections to design tokens and monospace eyebrows"
```

---

## Task 8: Dynamic per-post OG images

**Files:**
- Create: `app/blog/[slug]/opengraph-image.tsx`
- Modify: `app/blog/[slug]/page.tsx` (remove the manual `images` override so the file-based OG image is used, OR leave `generateMetadata` and let Next auto-attach the opengraph-image — see Step 2)

**Interfaces:**
- Produces: a per-slug 1200×630 PNG at `/blog/<slug>/opengraph-image`.

- [ ] **Step 1: Create the OG image route**

Create `app/blog/[slug]/opengraph-image.tsx`:
```tsx
import { ImageResponse } from "next/og";
import { allBlogs } from "contentlayer/generated";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Suryansh Chaudhary — build log";

export default async function OgImage({ params }: { params: { slug: string } }) {
  const post = allBlogs.find((p) => p.slug === params.slug);
  const title = post?.title ?? "Build log";
  const tag = post?.tags?.[0] ?? "build in public";

  return new ImageResponse(
    (
      <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#08070a", padding: 80, color: "#f5f4f2" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, color: "#d97757", fontSize: 28, letterSpacing: 4, textTransform: "uppercase" }}>
          suryansh.work · {tag}
        </div>
        <div style={{ display: "flex", fontSize: 68, fontWeight: 700, lineHeight: 1.05, maxWidth: 900 }}>{title}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 26, color: "#a1a1aa" }}>
          <span>Suryansh Chaudhary</span>
          <span style={{ color: "#d97757" }}>Building in public</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
```

- [ ] **Step 2: Let metadata use the generated image**

In `app/blog/[slug]/page.tsx` `generateMetadata`, remove the explicit `images: [image]` from both `openGraph` and `twitter` (and the `const image = post.image ?? "/og.png";` line) so Next auto-attaches the file-based `opengraph-image`. Keep everything else. If you prefer an explicit URL, set `images: [\`${url}/opengraph-image\`]` instead — but removing it is cleaner.

- [ ] **Step 3: Build + verify**

Run: `pnpm build` → succeeds (OG routes are generated per slug).
Run `pnpm dev`; visit `http://localhost:3000/blog/<an-existing-slug>/opengraph-image` → a 1200×630 PNG renders with the post title.
Use an existing slug, e.g. `building-macget-download-engine`.

- [ ] **Step 4: Commit**

```bash
git add app/blog/[slug]/opengraph-image.tsx app/blog/[slug]/page.tsx
git commit -m "feat: dynamic per-post OG images via next/og"
```

---

## Task 9: Article JSON-LD on blog posts

**Files:**
- Modify: `app/blog/[slug]/page.tsx`

**Interfaces:** none new. Server-rendered inline `<script type="application/ld+json">` in the post page.

- [ ] **Step 1: Add the JSON-LD block**

In `app/blog/[slug]/page.tsx`, inside `BlogPostPage`, after resolving `post` (and before/around the article JSX), render:
```tsx
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: post.title,
  description: post.description,
  datePublished: new Date(post.date).toISOString(),
  dateModified: new Date(post.date).toISOString(),
  author: { "@type": "Person", name: "Suryansh Chaudhary", url: "https://suryansh.work" },
  publisher: { "@type": "Person", name: "Suryansh Chaudhary" },
  mainEntityOfPage: { "@type": "WebPage", "@id": `https://suryansh.work/blog/${post.slug}` },
  image: [`https://suryansh.work/blog/${post.slug}/opengraph-image`],
  keywords: post.tags?.join(", "),
};
```
Then render at the top of the returned JSX:
```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
/>
```

- [ ] **Step 2: Verify**

Run: `pnpm build` → succeeds.
`pnpm dev`; view source of a post page; confirm the `Article` JSON-LD is present and `<` is escaped as `<`. Optionally paste into Google Rich Results Test.

- [ ] **Step 3: Commit**

```bash
git add app/blog/[slug]/page.tsx
git commit -m "feat: add Article JSON-LD structured data to blog posts"
```

---

## Task 10: RSS feed

**Files:**
- Create: `app/rss.xml/route.ts`
- Modify: `app/layout.tsx` (add `<link rel="alternate" type="application/rss+xml">` via metadata)

**Interfaces:**
- Produces: `GET /rss.xml` returning valid RSS 2.0 built from `allBlogs`.

- [ ] **Step 1: Create the route**

Create `app/rss.xml/route.ts`:
```ts
import { allBlogs } from "contentlayer/generated";

const BASE = "https://suryansh.work";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function GET() {
  const posts = allBlogs
    .filter((p) => p.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const items = posts
    .map(
      (p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${BASE}/blog/${p.slug}</link>
      <guid>${BASE}/blog/${p.slug}</guid>
      <description>${esc(p.description)}</description>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
    </item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Suryansh Chaudhary — Build Logs</title>
    <link>${BASE}</link>
    <description>Build-in-public logs, MacGet, and production AI systems.</description>
    <language>en-us</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
```

- [ ] **Step 2: Advertise the feed**

In `app/layout.tsx` metadata object, add:
```tsx
alternates: {
  canonical: "https://suryansh.work",
  types: { "application/rss+xml": "https://suryansh.work/rss.xml" },
},
```
(Merge into the existing `alternates` — don't duplicate the key.)

- [ ] **Step 3: Verify**

Run: `pnpm build` → succeeds.
`pnpm dev`; `curl -s http://localhost:3000/rss.xml | head -20` → valid RSS with items.

- [ ] **Step 4: Commit**

```bash
git add app/rss.xml/route.ts app/layout.tsx
git commit -m "feat: add RSS feed at /rss.xml"
```

---

## Task 11: llms.txt + sitemap RSS entry

**Files:**
- Create: `public/llms.txt`
- Modify: `app/sitemap.ts` (add `/rss.xml`? No — sitemaps list pages, not feeds; instead ensure blog `lastModified` uses post date, already true). Add `llms.txt` is static; nothing else.

**Interfaces:** none.

- [ ] **Step 1: Write `public/llms.txt`**

Create `public/llms.txt`:
```
# Suryansh Chaudhary — suryansh.work

> Full Stack AI Engineer building in public. Creator of MacGet, an open-source
> macOS download manager (SwiftUI + actor-based engine). Builds production AI
> agents (LangGraph, LangChain, FastAPI, Google Cloud Run).

## Key pages
- Home: https://suryansh.work
- MacGet: https://suryansh.work/macget
- Projects: https://suryansh.work/projects
- Blog / build logs: https://suryansh.work/blog
- Contact: https://suryansh.work/contact

## Links
- GitHub: https://github.com/Suryansh-Codes2209
- X: https://x.com/Suryansh_2001
- LinkedIn: https://www.linkedin.com/in/suryansh-chaudhary-2209/

## Focus
Build in public, open-source developer tools, macOS apps, AI agents, full-stack engineering.
```

- [ ] **Step 2: Verify**

Run: `pnpm build` → succeeds.
`pnpm dev`; `curl -s http://localhost:3000/llms.txt | head` → returns the file.

- [ ] **Step 3: Commit**

```bash
git add public/llms.txt
git commit -m "feat: add llms.txt for AI-crawler discovery"
```

---

## Task 12: Blogging workflow + docs cleanup

**Files:**
- Create: `content/blog/_TEMPLATE.mdx.txt` (a copy-paste template; `.txt` so Contentlayer ignores it)
- Modify: `CLAUDE.md`

**Interfaces:** none.

- [ ] **Step 1: Add a post template**

Create `content/blog/_TEMPLATE.mdx.txt`:
```mdx
---
published: false
title: "The decision behind X"
description: "One-sentence hook — what a reader learns."
date: 2026-07-10
tags: ["build-in-public", "macget"]
---

**What I shipped / decided.** One paragraph of context.

## The problem

## The approach

## What I'd do differently

_Building in public — follow along on [X](https://x.com/Suryansh_2001)._
```

- [ ] **Step 2: Update `CLAUDE.md`**

In `CLAUDE.md`:
- Remove the entire **Sounds** paragraph describing `fahhh.mp3`/Web Audio and the middle-finger `fuckyou.mp3` gesture scroll. Replace with a short note: "The hero intro is a fast, skippable terminal sequence (`hero-intro.tsx`), silent (the boom is a visual flash only)."
- Under Architecture, note the new components: `hero.tsx`/`hero-server.tsx` (proof-driven hero, build-time GitHub/MacGet stats via `app/data/stats.ts`), `now-bento.tsx`, and the blog SEO additions (`opengraph-image.tsx`, `Article` JSON-LD, `/rss.xml`, `public/llms.txt`).
- Add a **Blogging cadence** line: "Target 2–4 focused posts/month. Copy `content/blog/_TEMPLATE.mdx.txt` to `content/blog/{slug}.mdx`, set `published: true`. Use the `/build-log` skill to draft from recent work."

- [ ] **Step 3: Verify**

Run: `pnpm build` → succeeds (the `.txt` template is not picked up by Contentlayer's `*.mdx` glob).
Confirm `grep -n "fahhh\|fuckyou\|MediaPipe\|middle finger" CLAUDE.md` → no matches.

- [ ] **Step 4: Commit**

```bash
git add content/blog/_TEMPLATE.mdx.txt CLAUDE.md
git commit -m "docs: add blog post template and update CLAUDE.md for redesign"
```

---

## Task 13: Final verification pass

**Files:** none (verification only).

- [ ] **Step 1: Clean build**

Run: `rm -rf .next .contentlayer && pnpm build`
Expected: succeeds with no type errors, no warnings about missing modules.

- [ ] **Step 2: Bundle check**

Run: `grep -rn "mediapipe\|gesture-scroll\|GestureScroll\|fahhh\|fuckyou\|AudioContext" app/ public/ package.json`
Expected: no matches.

- [ ] **Step 3: Route checks**

Run `pnpm dev`, then:
```bash
for u in / /blog /rss.xml /llms.txt /sitemap.xml /robots.txt "/blog/building-macget-download-engine/opengraph-image"; do
  echo -n "$u -> "; curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:3000$u"
done
```
Expected: all `200`.

- [ ] **Step 4: Visual acceptance**

- Hero: oversized name, availability pill, small avatar, one primary CTA, social rail (desktop ≥lg), real proof numbers.
- Intro: fast (<4s), silent, skippable, once per session.
- `#now`: bento layout.
- Eyebrows: monospace; grain visible; calmer backgrounds.
- Reduced motion: set OS "reduce motion" → intro is skipped, animations minimal.

- [ ] **Step 5: Merge**

Follow superpowers:finishing-a-development-branch to merge `redesign/portfolio-2026` → `main` (or open a PR).

---

## Self-Review

**Spec coverage:**
- Remove fahhh sound → Task 2. ✓
- Remove MediaPipe hand-scroll + dep → Task 1. ✓
- Fast/skippable intro → Task 2. ✓
- Design tokens + mono + grain + trim orbs → Tasks 3, 7. ✓
- Proof-driven oversized-name hero (avatar hybrid, real stats) → Tasks 4, 5. ✓
- Bento (#now) → Task 6. ✓ (Projects bento: existing featured-MacGet + grid already reads as bento-like; deeper Projects bento deferred as optional — noted, not silently dropped.)
- Dynamic OG → Task 8. ✓
- Article JSON-LD → Task 9. ✓
- RSS → Task 10. ✓
- llms.txt → Task 11. ✓
- Blogging workflow/template + CLAUDE.md → Task 12. ✓
- page.tsx decomposition (hero, now) → Tasks 5, 6. ✓

**Placeholder scan:** No TBD/TODO; all code steps contain real code. The one conditional is the async-server-in-client-tree boundary (Task 5), which has an explicit fallback path — not a placeholder.

**Type consistency:** `getProofStats()`/`compact()` signatures match between `stats.ts` (Task 4) and `hero.tsx`/`hero-server.tsx` (Task 5). `NowBento`/`Hero`/`HeroServer` component names consistent across creation and wiring. Token names (`--bg`, `bg-surface`, `border-line`) consistent between Task 3 definition and Tasks 5–7 usage.

**Deferred (explicitly, not dropped):** full Projects-section bento restructure and blog-index redesign — the plan restyles them to tokens but does not re-layout them; can be a follow-up if desired.
