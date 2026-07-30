# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm fmt        # Rome lint+format. WARNING: reformats the whole repo 2-space → tabs.
                # Committed code is 2-space — never commit a repo-wide `pnpm fmt` pass.
```

There are no tests in this project.

## Architecture

**Project data — static:** Projects live as a typed array in `app/data/projects.ts` (no MDX, no Redis, no view counts). Edit that file to add/remove projects.

**Blog content — Contentlayer:** Blog posts are MDX files in `content/blog/` processed by `contentlayer.config.js` (uses the `contentlayer2` fork aliased as `contentlayer` for Next 14 compatibility). Only posts with `published: true` are listed. Imported as `allBlogs` from `"contentlayer/generated"`.

**Routing:** `/` is a single-page scroll site (hero, about, stack, projects, recommendations, blog, resume, contact) and includes the `HeroIntro` "recognition" intro.

**Hero intro:** `hero-intro.tsx` — ~4.5s skippable "recognition" sequence, once per session (`sessionStorage["recognition-intro-seen"]`), skipped under reduced motion. Cycles ~6 greetings from a 25-language pool (visitor's `navigator.language` first, Hello last; scramble-decode + shine sweep + cursor-magnetic glyphs). Live edge diagnostics read from the visitor's device; bottom-right runs a real speed test against `public/probe.bin` (measured Mbps also drives the shine speed). `app/api/weather/route.ts` (Vercel geo headers → Open-Meteo, never throws) feeds an additive rain/snow/clouds/sun-glow/stars backdrop layer over a time-of-day tint. Exits with an upward wipe. Design spec: `docs/superpowers/specs/2026-07-23-recognition-intro-design.md`.

**Hero (proof-driven):** `hero.tsx` is a client component. It renders immediately with zero stats, then `useEffect`-fetches `/api/stats` and fills in GitHub stars / MacGet downloads once the response lands — there's no server-rendered stats path. `app/api/stats/route.ts` (`revalidate: 86400`) calls `getProofStats()` in `app/data/stats.ts`, which hits the GitHub API for the MacGet repo (stars, release download counts) and never throws — a failed/rate-limited fetch falls back to zeros so the route always returns JSON.

**Now section:** `now-bento.tsx` renders the `#now` section as a static bento grid (current focus, build-log writing, AI agent work) — no data fetching, just curated copy.

**Design tokens:** Use Tailwind classes like `border-line`, `bg-surface`, and `font-mono` (JetBrains Mono) rather than hardcoding the values from `global.css`.

**Blog SEO:** Each post page (`app/blog/[slug]/page.tsx`) emits a single `BlogPosting` JSON-LD `<script>` block (not `Article`). The blog stays on `suryansh.work/blog` — this redesign didn't move or rename routes.

## Blogging cadence

Target 2–4 focused posts/month. Copy `content/blog/_TEMPLATE.mdx.txt` to `content/blog/{slug}.mdx` and set `published: true`. Use the `/build-log` skill to draft a post from recent work.
