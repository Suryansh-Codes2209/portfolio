# "Recognition" Intro — Design Spec

**Date:** 2026-07-23
**Replaces:** the fake-terminal boot screen in `app/components/hero-intro.tsx`

## Concept

When a visitor lands on `/`, instead of the terminal build-log intro, the site plays a
~4.5-second "recognition" sequence: an Apple-setup-style multilingual greeting that starts
in the visitor's own language, while the screen quietly scans and displays live facts about
their actual device — internet speed, local weather, battery, screen, FPS. The theme is
"the site recognized you." Fully skippable, once per session, absent under reduced motion.

## What stays from the old intro

The `HeroIntro` shell logic is proven and is kept as-is:

- Rendered from the same mount point on `/` (no page changes)
- Shown once per session via `sessionStorage` — **new key** (`recognition-intro-seen`) so
  returning visitors see the new intro one time
- Skippable via any keypress (and additionally any click/tap)
- Page scroll locked while active
- `prefers-reduced-motion: reduce` → intro never plays
- Renders nothing until mounted (no hydration flash)

All terminal internals (typed prompt, build log, spinner, boom flash) are removed.

## Sequence

| t (approx) | Event |
|---|---|
| 0.0s | Backdrop fades in: near-black + soft radial tint hued by the visitor's local clock (amber dawn/dusk, cool indigo night, neutral warm day). Weather fetch and speed test start immediately. |
| 0.2s | Greeting cycle begins (see below). |
| 0.6s | Edge diagnostics fade in, staggered. |
| ~4.5s | Editorial wipe exit: intro layer translates upward (expo ease, transform-only), revealing the site already rendered beneath. |

## Greeting cycle

- Large centered word in `font-display` (CalSans; non-Latin scripts fall back to system fonts — acceptable).
- Language pool (25 entries): Hello (en), नमस्ते (hi), Hola (es), Bonjour (fr), こんにちは (ja),
  안녕하세요 (ko), 你好 (zh), مرحبا (ar), Ciao (it), Olá (pt), Hallo (de), Привет (ru),
  নমস্কার (bn), வணக்கம் (ta), నమస్కారం (te), ਸਤ ਸ੍ਰੀ ਅਕਾਲ (pa), નમસ્તે (gu), Merhaba (tr),
  Γεια σας (el), שלום (he), สวัสดี (th), Xin chào (vi), Halo (id), Cześć (pl), Hej (sv).
- **Visitor's language first:** `navigator.language` primary subtag is matched against the pool;
  its greeting plays first. Unmatched → Hello first.
- ~6 words shown per visit at ~650ms each: the visitor's greeting + 5 drawn from the pool
  (shuffled), always ending on Hello if it hasn't appeared — so each visit shows a
  different mix, and the pool stays large without lengthening the intro. Per word:
  - **Scramble-morph in:** glyphs decode from random characters into the word over ~250ms.
  - **Shine sweep:** a warm gradient highlight sweeps across the glyphs
    (background-clip technique from `shine-text.tsx`). Sweep duration maps to measured
    download speed — fast connection → fast sweep. Before the measurement lands, a
    medium default is used.
  - **Cursor-magnetic glyphs:** each glyph is a span that translates away from the pointer
    within ~100px proximity. rAF-driven, transform-only, disabled on touch devices.

## Bottom-right: live speed test

- Shows `measuring…` instantly (or the Network Information API `downlink` estimate as a
  first guess where the API exists — Chromium only).
- **Latency:** time a small same-origin `HEAD`/fetch round-trip, shown in ms.
- **Throughput:** fetch `public/probe.bin` (~200KB of random bytes) with a cache-busting
  query param, compute Mbps from elapsed time, shown as `↓ 42.3 Mbps · 18ms`.
- Updates in place as results land. Fetch failure → shows `offline?`. The measured Mbps
  also drives the shine-sweep speed.

## Edge diagnostics (faint mono, staggered fade-in)

- **Top-left:** screen resolution + device pixel ratio (`2560×1440 @2x`)
- **Top-right:** local time; battery % where the Battery API exists (Chromium) — omitted otherwise
- **Bottom-left:** OS · browser · locale · CPU cores (`hardwareConcurrency`), plus a live FPS tick
- **Bottom-right:** the speed test (above)
- A weather line joins the diagnostics when the weather fetch lands: `city · 24°C · light rain`

## Weather-aware backdrop

- New route `app/api/weather/route.ts`: reads Vercel request geo headers
  (`x-vercel-ip-city`, `x-vercel-ip-latitude/longitude`), calls Open-Meteo current-weather
  (free, no key), returns `{ city, tempC, condition }`. Route revalidates/caches briefly
  (~30 min) and **never throws** — missing headers (e.g. localhost) or a failed upstream
  fetch return `{ available: false }`.
- Client fires the fetch at intro mount; whenever it resolves, the matching layer fades in
  **additively** over the time-of-day tint:
  - rain/drizzle → faint falling rain streaks (very low opacity)
  - snow → slow drifting flecks
  - clear night → a few twinkling star pixels
  - cloudy/day/unavailable → time-of-day tint only
- Layers are CSS/lightweight-canvas, capped particle counts, transform/opacity only.

## Exit

- No fade. The intro layer wipes **upward** off-screen (`y: -100%`, expo-out, ~0.8s);
  the site beneath is fully rendered the whole time, so the wipe is a pure transform.

## Error handling & degradation

Every device read and network call is individually try-caught; a failed probe simply
omits its readout — the greeting cycle never blocks on any of them. Reduced motion skips
everything (existing behavior). On touch devices cursor magnetism is off; diagnostics
font size scales down on small viewports.

## Files

| File | Change |
|---|---|
| `app/components/hero-intro.tsx` | Rewritten: greeting cycle, hooks `useSpeedTest` / `useDiagnostics`, `ScrambleWord` subcomponent, weather layers, wipe exit |
| `app/api/weather/route.ts` | New: Vercel geo → Open-Meteo, never-throw JSON |
| `public/probe.bin` | New: ~200KB random-byte payload for the throughput test |

No new dependencies (framer-motion already present). No tests (per project convention).
