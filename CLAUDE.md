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

This is a Next.js 14 personal portfolio site using the App Router. Key architectural decisions:

**Content Management via Contentlayer:** All project content lives as MDX files in `content/projects/`. Contentlayer processes these at build time into typed TypeScript objects (imported as `allProjects` from `"contentlayer/generated"`). The config in `contentlayer.config.js` defines `Project` and `Page` document types with fields like `published`, `title`, `description`, `date`, `url`, and `repository`. Only projects with `published: true` appear in listings.

**Page View Tracking with Upstash Redis:** The `/projects` page and individual project pages fetch real-time view counts from Upstash Redis. Views are incremented via `pages/api/incr.ts` (Edge runtime), which deduplicates by hashed IP per slug with a 24-hour TTL. Redis keys follow the pattern `pageviews:projects:{slug}`. Requires `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` environment variables.

**Routing structure:**
- `/` — Home page with particle animation and profile
- `/projects` — Grid listing of all published projects (ISR with 60s revalidation)
- `/projects/[slug]` — Individual project page rendered from MDX
- `/contact` — Contact page
- `pages/api/incr.ts` — Edge API route for view counting (uses Pages Router, not App Router)

**Fonts:** Two custom fonts loaded via `@next/font` — Inter (variable `--font-inter`) and CalSans SemiBold (variable `--font-calsans`, used as `font-display` in Tailwind).

**Featured projects:** The `/projects` page hardcodes specific slugs (`unkey`, `planetfall`, `highstorm`) as featured/top positions. When adding new featured projects, update those references in `app/projects/page.tsx`.

## Adding a New Project

Create `content/projects/{slug}.mdx` with frontmatter:
```mdx
---
published: true
title: "Project Title"
description: "Short description"
date: 2024-01-01
url: https://example.com
repository: owner/repo
---

Content here...
```
