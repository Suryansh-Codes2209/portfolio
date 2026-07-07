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
- `/` — Single-page scroll site (hero, about, stack, projects, recommendations, blog, resume, contact). Includes the `HeroIntro` cinematic terminal intro (auto-types a build prompt, streams a fake build log, boom flash, then reveals the site).
- `/projects` — Grid listing of all projects from static data
- `/blog` — Blog index
- `/blog/[slug]` — MDX blog post
- `/contact` — Contact page

**Fonts:** Inter (Google) and a local CalSans SemiBold loaded via `next/font`. CSS variables `--font-inter` and `--font-calsans` (the latter mapped to Tailwind's `font-display`).

**Sounds:** `public/sounds/` holds audio clips wired into interactive components — `fahhh.mp3` plays on the hero intro's boom flash, `fuckyou.mp3` plays when the camera-based hand-scroll detects a middle finger. The intro auto-plays (no click gate). `fahhh.mp3` plays through the **Web Audio API** (an `AudioContext`, not `<audio>`): the clip is decoded to a buffer up front, and the context is resumed on the visitor's first gesture (touch/click/key/scroll/move) via a silent 1-sample buffer. Once resumed, the buffer can fire from the boom's `setTimeout` — this is what makes it work on iOS, where a muted `<audio>` prime never authorizes later unmuted timer-driven playback. A fully idle first load stays silent (autoplay policy requires user activation).

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
