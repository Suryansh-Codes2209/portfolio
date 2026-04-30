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
- `/` — Single-page scroll site (hero, about, stack, projects, recommendations, blog, resume, contact). Includes the `HeroIntro` 3D scroll-driven intro.
- `/projects` — Grid listing of all projects from static data
- `/blog` — Blog index
- `/blog/[slug]` — MDX blog post
- `/contact` — Contact page

**Fonts:** Inter (Google) and a local CalSans SemiBold loaded via `next/font`. CSS variables `--font-inter` and `--font-calsans` (the latter mapped to Tailwind's `font-display`).

**Sounds:** `public/sounds/` holds audio clips wired into interactive components — `fahhh.mp3` plays at the end of the hero intro, `fuckyou.mp3` plays when the camera-based hand-scroll detects a middle finger. Audio is unlocked by a "Click to begin" gate on the intro (Chrome autoplay policy requires user activation).

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
