# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # Start development server
pnpm build      # Build for production (also runs contentlayer)
pnpm start      # Start production server
pnpm fmt        # Lint and format with Rome (applies unsafe fixes)
```

There are no tests in this project.

## Architecture

Next.js 14 personal portfolio site using the App Router.

**Project data — static:** Projects live as a typed array in `app/data/projects.ts` (no MDX, no Redis, no view counts). Edit that file to add/remove projects.

**Blog content — Contentlayer:** Blog posts are MDX files in `content/blog/` processed by `contentlayer.config.js` (uses the `contentlayer2` fork aliased as `contentlayer` for Next 14 compatibility). The `Blog` document type defines fields `published`, `title`, `description`, `date`, `tags`, `readingTime`. Only posts with `published: true` are listed. Imported as `allBlogs` from `"contentlayer/generated"`.

**Routing:**
- `/` — Single-page scroll site (hero, about, stack, projects, recommendations, blog, resume, contact). Includes the `HeroIntro` "recognition" intro (Apple-style multilingual greeting — visitor's language first — plus live device diagnostics: real speed test, screen/OS/battery/FPS readouts, weather-aware backdrop, upward wipe reveal).
- `/projects` — Grid listing of all projects from static data
- `/blog` — Blog index
- `/blog/[slug]` — MDX blog post
- `/contact` — Contact page

**Fonts:** Inter (Google), a local CalSans SemiBold, and JetBrains Mono, all loaded via `next/font`. CSS variables `--font-inter`, `--font-calsans` (mapped to Tailwind's `font-display`), and `--font-mono` (mapped to Tailwind's `font-mono`).

**Hero intro:** `hero-intro.tsx` — ~4.5s skippable "recognition" sequence, once per session (`sessionStorage["recognition-intro-seen"]`), skipped under reduced motion. Cycles ~6 greetings from a 25-language pool (visitor's `navigator.language` first, Hello last; scramble-decode + shine sweep + cursor-magnetic glyphs). Live edge diagnostics read from the visitor's device; bottom-right runs a real speed test against `public/probe.bin` (measured Mbps also drives the shine speed). `app/api/weather/route.ts` (Vercel geo headers → Open-Meteo, never throws) feeds an additive rain/snow/stars backdrop layer over a time-of-day tint. Exits with an upward wipe. Design spec: `docs/superpowers/specs/2026-07-23-recognition-intro-design.md`.

**Hero (proof-driven):** `hero.tsx` is a client component. It renders immediately with zero stats, then `useEffect`-fetches `/api/stats` and fills in GitHub stars / MacGet downloads once the response lands — there's no server-rendered stats path. `app/api/stats/route.ts` (`revalidate: 86400`) calls `getProofStats()` in `app/data/stats.ts`, which hits the GitHub API for the MacGet repo (stars, release download counts) and never throws — a failed/rate-limited fetch falls back to zeros so the route always returns JSON.

**Now section:** `now-bento.tsx` renders the `#now` section as a static bento grid (current focus, build-log writing, AI agent work) — no data fetching, just curated copy.

**Design tokens:** `global.css` defines root CSS vars (`--bg`, `--surface`, `--surface-2`, `--border`, `--text`, `--text-muted`, `--text-faint`, `--accent`) that `tailwind.config.js` wires up as `bg`, `surface`, `surface-2`, `line` (border) colors and the `claude` orange palette. Use Tailwind classes like `border-line`, `bg-surface`, and `font-mono` (JetBrains Mono) rather than hardcoding these values.

**Blog SEO:** `app/blog/[slug]/opengraph-image.tsx` generates a dynamic per-post OG image via `next/og`'s `ImageResponse`. Each post page (`app/blog/[slug]/page.tsx`) emits a single `BlogPosting` JSON-LD `<script>` block (not `Article`). `app/rss.xml/route.ts` serves an RSS feed of published posts at `/rss.xml`. `public/llms.txt` gives LLM crawlers a plain-text summary of the site. The blog stays on `suryansh.work/blog` — this redesign didn't move or rename routes.

## Adding a Blog Post

Create `content/blog/{slug}.mdx`:

```mdx
---
published: true
title: "Post title"
description: "Short description"
date: 2026-01-01
tags: ["nextjs", "react"]
---

Content here...
```

## Blogging cadence

Target 2–4 focused posts/month. Copy `content/blog/_TEMPLATE.mdx.txt` to `content/blog/{slug}.mdx` and set `published: true`. Use the `/build-log` skill to draft a post from recent work.
