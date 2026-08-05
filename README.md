<div align="center">

# suryansh.work

**Personal site, build-log blog, and build-in-public home of [Suryansh Chaudhary](https://suryansh.work).**

A single-page scroll portfolio with a full MDX blog platform — anonymous likes, double opt-in
email subscriptions, cron-driven new-post notifications, and a weather-aware animated intro.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Contentlayer](https://img.shields.io/badge/Contentlayer2-0.5-orange)](https://github.com/timlrx/contentlayer2)
[![Deployed on Vercel](https://img.shields.io/badge/Vercel-deployed-black?logo=vercel)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

[Live site](https://suryansh.work) · [Blog](https://suryansh.work/blog) · [MacGet](https://macget.suryansh.work)

</div>

---

## Table of contents

- [Overview](#overview)
- [Tech stack](#tech-stack)
- [Quick start](#quick-start)
- [Environment variables](#environment-variables)
- [Project structure](#project-structure)
- [Architecture](#architecture)
  - [Routing](#routing)
  - [The recognition intro](#the-recognition-intro)
  - [Hero & proof stats](#hero--proof-stats)
  - [Blog pipeline (Contentlayer)](#blog-pipeline-contentlayer)
  - [Blog platform features](#blog-platform-features)
  - [Design tokens & theming](#design-tokens--theming)
- [API reference](#api-reference)
- [Writing a post](#writing-a-post)
- [SEO & discoverability](#seo--discoverability)
- [Deployment](#deployment)
- [Conventions & gotchas](#conventions--gotchas)
- [License](#license)

---

## Overview

This repo is two things wearing one coat:

1. **A portfolio** — `/` is a single-page scroll site (hero → now → about → projects →
   recommendations → blog → resume → contact) plus standalone `/projects` and `/contact` pages.
2. **A blog platform** — MDX posts compiled by Contentlayer, with anonymous per-visitor likes
   (Redis), a double opt-in newsletter (Postgres + Resend), and a daily cron that announces new
   posts to confirmed subscribers.

Every backend integration **degrades gracefully**. Leave an env-var group blank and that feature
quietly disables itself — likes hide, subscribe returns a friendly 503, weather falls back to a
time-of-day tint. The site always builds and always renders.

---

## Tech stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | **Next.js 14** (App Router) | RSC where possible; client components for motion |
| Language | **TypeScript 5.7** (`strict`) | Path alias `@/*` → repo root |
| Styling | **Tailwind CSS 3.4** + CSS custom properties | Semantic tokens, not hardcoded hex |
| Content | **Contentlayer2** (aliased as `contentlayer`) | MDX → typed `allBlogs` at build time |
| MDX plugins | `remark-gfm`, `rehype-pretty-code`, `rehype-slug`, `rehype-autolink-headings` | `github-dark` code theme |
| Animation | **Framer Motion 10** | Scroll reveals, intro sequence, particles |
| Icons | `lucide-react` + `react-icons/si` | Lucide for UI, Simple Icons for brands |
| Theming | `next-themes` (class strategy) | Light default, `.dark` override |
| Likes | **Upstash Redis** via `ioredis` | TCP/TLS `rediss://` endpoint, Node runtime |
| Subscribers | **Supabase Postgres** via `postgres.js` | Transaction pooler, `prepare: false` |
| Email | **Resend** | Confirm + new-post broadcast |
| Analytics | Google Analytics 4 + optional Beam | GA ID is inlined; Beam is env-gated |
| Lint/format | **Rome 12** | ⚠️ see [gotchas](#conventions--gotchas) |
| Hosting | **Vercel** | Cron via `vercel.json` |
| Fonts | Inter (sans), CalSans (display, local), JetBrains Mono (mono) | CSS variables |

No test suite — this is a content site, verified by `pnpm build` and eyes on `pnpm dev`.

---

## Quick start

```bash
# 1. Install (pnpm is the package manager — pnpm-lock.yaml is committed)
pnpm install

# 2. Configure — every var is optional; blank groups disable their feature
cp .env.example .env.local

# 3. Run
pnpm dev            # http://localhost:3000
```

| Script | What it does |
|---|---|
| `pnpm dev` | Next dev server; Contentlayer watches `content/` and regenerates on save |
| `pnpm build` | Production build — **run this after adding/editing frontmatter** |
| `pnpm start` | Serve the production build |
| `pnpm fmt` | Rome lint `--apply-unsafe` + format `--write` — **read the warning below first** |

> [!WARNING]
> `pnpm fmt` reformats the **entire repo** from 2-space indentation to tabs. The committed code is
> 2-space. Never commit a repo-wide `pnpm fmt` pass — it produces a diff of thousands of lines that
> hides your actual change.

---

## Environment variables

Copy `.env.example` → `.env.local` (gitignored). The same values go into
**Vercel → Settings → Environment Variables** for production.

| Variable | Feature | Required? | Notes |
|---|---|---|---|
| `RESEND_API_KEY` | Email | For subscribe/notify | Resend dashboard; verify your sending domain |
| `RESEND_FROM` | Email | With Resend | e.g. `Suryansh <hello@suryansh.work>`; defaults to `onboarding@resend.dev` |
| `RESEND_REPLY_TO` | Email | Optional | Sets `replyTo` on outgoing mail |
| `REDIS_URL` | Likes, notify dedupe | For likes | Upstash **TCP/TLS** endpoint (`rediss://…upstash.io:6379`), not the REST URL |
| `LIKE_SALT` | Likes | With Redis | Any long random string; salts the visitor hash |
| `DATABASE_URL` | Subscribers | For subscribe | Supabase Postgres pooler connection string |
| `NEXT_PUBLIC_SITE_URL` | Email links | Recommended | Builds confirm/unsubscribe/post URLs; defaults to `https://suryansh.work` |
| `CRON_SECRET` | Notify cron | For notify | Bearer token Vercel Cron sends; also accepted as `?secret=` |
| `GOOGLE_SITE_VERIFICATION` | SEO | Optional | Emits the Search Console meta tag when set |
| `NEXT_PUBLIC_BEAM_TOKEN` | Analytics | Optional | Beam Analytics; the `<script>` renders only when set |

**Never put real secrets in `.env.example`** — it's committed.

Degradation matrix:

| Missing | Result |
|---|---|
| `REDIS_URL` | `getRedis()` → `null`; likes API returns `{ enabled: false }` and the button hides |
| `DATABASE_URL` | `getSql()` → `null`; subscribe returns 503 with a friendly message |
| `RESEND_API_KEY` | `getResend()` → `null`; subscribe 503, notify 503 |
| `CRON_SECRET` | `/api/notify` returns 401 to everyone (fail closed) |
| Vercel geo headers (local dev) | Weather falls back to Bengaluru coords in dev, `{ available: false }` in prod |
| GitHub API rate limit | Hero stats fall back to zeros; the route always returns JSON |

---

## Project structure

```
.
├── app/
│   ├── layout.tsx                 # Root layout: fonts, metadata, JSON-LD @graph, providers
│   ├── page.tsx                   # The single-page scroll site (all # sections)
│   ├── global.css                 # Design tokens (:root / .dark), grain, tech-pattern
│   │
│   ├── api/
│   │   ├── stats/route.ts         # GitHub stars + MacGet downloads (revalidate 24h)
│   │   ├── weather/route.ts       # Vercel geo → Open-Meteo, never throws
│   │   ├── likes/[slug]/route.ts  # GET count / POST like (Redis, rate-limited)
│   │   ├── subscribe/route.ts     # POST email → row + confirmation mail
│   │   ├── confirm/route.ts       # GET ?token → status = confirmed
│   │   ├── unsubscribe/route.ts   # GET ?token → status = unsubscribed
│   │   └── notify/route.ts        # Cron: broadcast unannounced posts
│   │
│   ├── blog/
│   │   ├── layout.tsx             # /blog metadata + canonical
│   │   ├── page.tsx               # Index: featured post, tag filter, covers
│   │   └── [slug]/
│   │       ├── page.tsx           # Post page + BlogPosting JSON-LD
│   │       ├── opengraph-image.tsx# Generated 1200×630 OG fallback
│   │       └── mdx.css            # Prose/code styling for rendered MDX
│   │
│   ├── projects/{layout,page}.tsx # Standalone projects page
│   ├── contact/{layout,page}.tsx  # Standalone contact page
│   │
│   ├── components/
│   │   ├── hero.tsx               # Proof-driven hero (client-fetches /api/stats)
│   │   ├── hero-intro.tsx         # ~4.5s recognition intro (776 lines, see below)
│   │   ├── now-bento.tsx          # #now bento grid — static curated copy
│   │   ├── tech-stack.tsx         # Categorised stack grid with brand-hue hovers
│   │   ├── mdx.tsx                # MDX component map (headings, links, Callout, Pre)
│   │   ├── card.tsx, particles.tsx, shine-text.tsx, cursor-glow.tsx
│   │   ├── scroll-progress.tsx, back-to-top.tsx, theme-{provider,toggle}.tsx
│   │   ├── motion-provider.tsx, analytics.tsx, google-analytics.tsx
│   │   └── blog/
│   │       ├── like-button.tsx, subscribe-form.tsx, share-actions.tsx
│   │       ├── post-toc.tsx, reading-progress.tsx, author-bit.tsx
│   │       ├── callout.tsx, copy-code.tsx
│   │
│   ├── data/
│   │   ├── projects.ts            # Typed static project array — edit to add projects
│   │   └── stats.ts               # getProofStats() + compact() number formatter
│   │
│   ├── lib/
│   │   ├── redis.ts               # Shared ioredis client (global-cached, nullable)
│   │   ├── db.ts                  # postgres.js client + ensureSchema()
│   │   ├── resend.ts              # Resend client + FROM / REPLY_TO / SITE_URL
│   │   ├── emails.ts              # confirmEmail() / newPostEmail() templates
│   │   ├── visitor.ts             # SHA-256(ip|ua|salt) privacy-preserving hash
│   │   ├── related-posts.ts       # Tag-overlap ranking for "related reading"
│   │   └── result-page.ts         # Minimal HTML response for confirm/unsubscribe
│   │
│   ├── sitemap.ts, robots.ts      # Metadata routes
│   ├── rss.xml/route.ts           # Hand-rolled RSS 2.0 feed
│   └── llms.txt/, llms-full.txt/  # AI-assistant site maps, generated from Contentlayer
│
├── content/blog/                  # MDX posts + _TEMPLATE.mdx.txt
├── public/blog/<slug>.png         # Per-post cover art
├── docs/                          # Setup notes + design specs
├── .claude/commands/build-log.md  # /build-log slash command for Claude Code
├── contentlayer.config.js         # Blog document type + MDX plugin chain
├── next.config.mjs                # withContentlayer + /macget redirects + warning filters
├── tailwind.config.js             # Token → utility mapping, claude palette, keyframes
└── vercel.json                    # Daily cron → /api/notify at 09:00 UTC
```

---

## Architecture

### Routing

| Route | Type | Notes |
|---|---|---|
| `/` | Client component | Single-page scroll: `#now`, `#about`, `#projects`, `#testimonials`, `#blog`, `#resume`, `#contact` |
| `/blog` | Client component | Featured post + tag filter, wrapped in a server `layout.tsx` for metadata |
| `/blog/[slug]` | Server component | `revalidate = 60`, `generateStaticParams` over published posts |
| `/projects` | Client component | Renders `app/data/projects.ts` |
| `/contact` | Client component | Social cards + `mailto:` form |
| `/macget`, `/macget/*` | Permanent redirect | → `macget.suryansh.work` (moved to its own deployment; old paths were indexed) |
| `/rss.xml`, `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/llms-full.txt` | Route handlers | All derived from `allBlogs` |

> [!IMPORTANT]
> Client-component routes can't export `metadata`. That's why `/blog`, `/projects`, and `/contact`
> each have a sibling **server** `layout.tsx` that owns their title, description, and — critically —
> their `alternates.canonical`. Without it, the root layout's canonical (`https://suryansh.work`)
> leaks into the route and Google deindexes it as a duplicate. **Any new client-component route
> needs its own `layout.tsx`.**

### The recognition intro

`app/components/hero-intro.tsx` — a ~4.5s skippable "recognition" sequence that plays **once per
session** (`sessionStorage["recognition-intro-seen"]`) and is skipped entirely under
`prefers-reduced-motion`.

- Cycles ~6 greetings drawn from a **25-language pool**. The visitor's `navigator.language` plays
  first; 4–5 shuffled others fill the middle; `Hello` always closes.
- Each greeting scramble-decodes into place, with a shine sweep and cursor-magnetic glyphs.
- **Live edge diagnostics** read from the visitor's own device.
- Bottom-right runs a **real speed test** against `public/probe.bin` (200 KB). The measured Mbps also
  drives the shine sweep speed — the animation literally runs at your connection's pace.
- `app/api/weather/route.ts` (Vercel geo headers → Open-Meteo) feeds an additive
  rain / snow / clouds / sun-glow / stars backdrop layered over a time-of-day tint.
- Exits with an upward wipe into the hero.

Full design spec: [`docs/superpowers/specs/2026-07-23-recognition-intro-design.md`](./docs/superpowers/specs/2026-07-23-recognition-intro-design.md).

### Hero & proof stats

`hero.tsx` is a client component that renders **immediately with zero stats**, then `useEffect`-fetches
`/api/stats` and fills in GitHub stars and MacGet download counts when the response lands. There is
no server-rendered stats path — the hero never blocks on the GitHub API.

`/api/stats` (`revalidate = 86400`) calls `getProofStats()` in `app/data/stats.ts`, which hits the
GitHub API for the MacGet repo (stargazers + summed release asset `download_count`) and **never
throws** — a failed or rate-limited fetch falls back to zeros so the route always returns JSON.

### Blog pipeline (Contentlayer)

`contentlayer.config.js` defines one document type:

```js
Blog {
  filePathPattern: "./blog/**/*.mdx"
  fields: {
    title:       string   // required
    description: string   // required
    date:        date     // required
    published:   boolean  // only `true` is ever listed
    tags:        string[]
    readingTime: number   // minutes
    image:       string   // /blog/<slug>.png — omit to use the generated OG card
  }
  computedFields: { path, slug }
}
```

Posts are imported as `allBlogs` from `"contentlayer/generated"` (aliased in `tsconfig.json` to
`./.contentlayer/generated`). The **`contentlayer2` fork** is aliased as `contentlayer` in
`package.json` — the original package doesn't support Next 14.

MDX rehype chain: `rehype-slug` (heading IDs) → `rehype-pretty-code` (`github-dark`, with
`line--highlighted` / `word--highlighted` classes) → `rehype-autolink-headings` (`.subheading-anchor`).

Everything downstream — the blog index, RSS, sitemap, `llms.txt`, `llms-full.txt`, related posts,
the notify cron's slug diff — reads from `allBlogs`. Add an MDX file and all of them update.

### Blog platform features

**Anonymous likes.** One like per visitor per post, no accounts. The visitor is identified by
`sha256(ip | user-agent | LIKE_SALT).slice(0, 24)` — the raw IP is never stored. Deliberately coarse
(shared NATs collapse into one bucket), which is the right bar for a like button. Redis keys:

```
post:<slug>:likes      # counter
like:<slug>:<visitor>  # SET NX, 1-year TTL → dedupe
rl:like:<visitor>      # fixed-window rate limit, 20 actions/min
```

Unknown or unpublished slugs are rejected against `allBlogs`, so nobody can inflate arbitrary keys.

**Double opt-in newsletter.** `POST /api/subscribe` upserts into a `subscribers` table
(auto-created by `ensureSchema()` on first use) and sends a Resend confirmation mail.
`GET /api/confirm?token=` flips `pending` → `confirmed`. Every outgoing email carries a one-click
`GET /api/unsubscribe?token=` link. Re-subscribing after unsubscribing resets you to `pending`.

```sql
subscribers (
  id           uuid primary key default gen_random_uuid(),
  email        text unique not null,
  status       text not null default 'pending',  -- pending | confirmed | unsubscribed
  token        uuid not null default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  confirmed_at timestamptz
)
```

**New-post notifications.** `vercel.json` registers a daily cron (`0 9 * * *`) against `/api/notify`.
It diffs published slugs against a Redis set (`notified:posts`) and emails every `confirmed`
subscriber about anything new.

> The **first run seeds the set and sends nothing** (`notified:init` flag), so your entire back
> catalogue never blasts the list. Only posts published *after* that first run trigger a broadcast.

Hobby-plan crons are daily-only, so a new post is announced within ~24h. To announce immediately:
`GET /api/notify?secret=$CRON_SECRET`.

**Reading experience.** Reading-progress bar, sticky table of contents built from heading IDs, copy
buttons on code blocks, share actions, author bit, and a "related reading" block ranked by tag
overlap (`relatedPosts()` — ties break toward the more recent post, zero-overlap posts are dropped).

### Design tokens & theming

`global.css` defines the whole palette as CSS custom properties on `:root` (light, the default) with
a `.dark` override that `next-themes` toggles on `<html>`:

```
--bg / --bg-2            page backgrounds
--surface / --surface-2  cards, insets
--line / --line-strong   borders
--fg / --fg-muted / --fg-subtle / --fg-faint   text ramp
--accent / --accent-text / --accent-soft / --accent-fg   the burnt-orange accent
--grain-opacity, --edge-outline
```

`tailwind.config.js` maps these to utilities: `bg-bg`, `bg-surface`, `border-line`, `text-fg-muted`,
`bg-accent-soft`, and so on. There's also a static `claude-50…900` orange ramp for fixed brand hues.

> [!IMPORTANT]
> **Use the token utilities, never raw hex from `global.css`.** `border-line` adapts across themes;
> `border-[rgba(28,25,23,0.10)]` does not. Same for `font-mono` (JetBrains Mono) and `font-display`
> (CalSans) over hardcoded font stacks.

Two texture layers ship globally: `.grain` (fixed SVG `feTurbulence` noise overlay on `<body>`) and
`.tech-pattern` (a slowly drifting masked dot grid behind the tech stack). A global
`prefers-reduced-motion` block collapses every animation and transition to 0.01ms.

---

## API reference

| Route | Method | Auth | Runtime | Response |
|---|---|---|---|---|
| `/api/stats` | GET | — | default, `revalidate 86400` | `{ githubStars, macgetDownloads }` |
| `/api/weather` | GET | — | default, per-request geo | `{ available, city?, tempC?, condition?, kind?, isNight? }` |
| `/api/likes/[slug]` | GET | — | nodejs, dynamic | `{ count, liked, enabled }` |
| `/api/likes/[slug]` | POST | visitor hash | nodejs, dynamic | `{ count, liked, enabled }` · 404 unknown slug · 429 rate limited |
| `/api/subscribe` | POST | — | nodejs, dynamic | `{ ok, message }` · 400 bad email · 502 send failed · 503 unconfigured |
| `/api/confirm?token=` | GET | token | nodejs, dynamic | HTML result page |
| `/api/unsubscribe?token=` | GET | token | nodejs, dynamic | HTML result page |
| `/api/notify` | GET | `Bearer $CRON_SECRET` or `?secret=` | nodejs, dynamic | `{ sent, fresh, subscribers }` or `{ seeded, count, sent }` |

The Redis- and Postgres-backed routes pin `runtime = "nodejs"` — `ioredis` needs real TCP sockets
and won't run on Edge.

---

## Writing a post

**Cadence: 2–4 focused posts per month.**

```bash
cp content/blog/_TEMPLATE.mdx.txt content/blog/my-post-slug.mdx
```

```mdx
---
published: true
title: "Clear, specific, search-friendly title"
description: "1–2 sentences naming the concrete thing built. This is the SEO snippet and card copy."
date: 2026-08-05
tags: ["build-in-public", "macget"]     # 3–5, real tech + topic
readingTime: 6                          # honest estimate, minutes
image: "/blog/my-post-slug.png"         # optional 1200×630; omit → generated OG card
---
```

Then:

```bash
pnpm build   # regenerates Contentlayer from the new frontmatter
pnpm dev     # review at /blog and /blog/my-post-slug
```

Notes:

- Only `published: true` posts appear anywhere — index, RSS, sitemap, `llms.txt`, notifications.
- Cover art at `public/blog/<slug>.png` is rendered at **128px wide** on the blog index, so headlines
  and shapes have to survive a thumbnail. Posts with no `image` fall back to the generated
  `opengraph-image.tsx` card.
- Related-reading links are automatic — they come from **tag overlap**, so reuse tags deliberately.
- **`/build-log`** — a Claude Code slash command (`.claude/commands/build-log.md`) that drafts a post
  from your recent commits and diffs, researches current terminology, and hands off for review.
  It writes the file but never commits.
- `scripts/` holds local-only Gemini authoring tools (draft a post, generate cover art from a
  two-pass brief). That folder is **gitignored** — nothing deployed depends on it. See
  `scripts/README.md` locally if you have it.

---

## SEO & discoverability

- **JSON-LD entity graph** in the root layout: `Person` + `WebSite` + `ProfilePage`, each with a
  stable `@id` (`https://suryansh.work/#person`, `#website`, `#profilepage`) so Google can
  disambiguate this Suryansh Chaudhary from the many others.
- **Per-post `BlogPosting`** JSON-LD on `/blog/[slug]` — a single block, not `Article`, whose
  `author` and `publisher` point at the site-wide `#person` node so authorship consolidates.
- **Canonicals everywhere.** Root layout sets the site canonical; each sub-route layout and
  `generateMetadata` override it. See the routing warning above.
- **`sitemap.ts`** — static routes plus every published post. Hub pages use the newest post's date as
  `lastModified` so they don't churn on unrelated redeploys; posts get priority `0.8` (above the
  secondary static pages) because they earn the long-tail traffic.
- **`robots.ts`** — disallows `/api/` and `/_next/static/chunks/`, and explicitly allows `GPTBot`,
  `OAI-SearchBot`, `ClaudeBot`, `PerplexityBot`, and `Google-Extended`.
- **`llms.txt` / `llms-full.txt`** — a curated Markdown site map and a full-corpus dump for AI
  assistants, both generated from Contentlayer so they can't drift out of date.
- **`rss.xml`** — hand-rolled RSS 2.0, advertised via `alternates.types` in the metadata.
- **OG images** — `public/og.png` site-wide; per-post covers when present; otherwise a generated
  1200×630 card from `opengraph-image.tsx`.
- `GOOGLE_SITE_VERIFICATION` conditionally emits the Search Console meta tag.

---

## Deployment

Hosted on **Vercel**; pushes to `main` deploy automatically.

1. **Add every env var** from `.env.example` to the Production environment, with real values.
   Set `NEXT_PUBLIC_SITE_URL=https://suryansh.work` — it builds the confirm, unsubscribe, and post
   links inside emails, so it must be the real domain.
2. **Push to `main`.** Vercel builds; Contentlayer runs as part of `next build`.
3. **The cron is already wired** in `vercel.json` (`/api/notify`, `0 9 * * *`). Vercel sends
   `Authorization: Bearer $CRON_SECRET` automatically.

`next.config.mjs` also filters a few noisy build warnings (Contentlayer's `Critical dependency`
message, a React Three Fiber `unstable_act` warning) and drops webpack infrastructure logging to
`error` — cosmetic only, nothing functional.

More detail, including credential rotation notes: [`docs/blog-platform-setup.md`](./docs/blog-platform-setup.md).

---

## Conventions & gotchas

| | |
|---|---|
| **Indentation** | Committed code is **2-space**. `pnpm fmt` (Rome) rewrites the repo to tabs — never commit a repo-wide pass. |
| **New client routes** | Need their own server `layout.tsx` with `alternates.canonical`, or the root canonical leaks and the route gets deindexed. |
| **Design tokens** | Use `bg-surface` / `border-line` / `text-fg-muted` / `font-mono`, never raw values from `global.css`. |
| **Projects** | Static typed array in `app/data/projects.ts`. No MDX, no Redis, no view counts. |
| **Contentlayer** | It's the `contentlayer2` fork aliased as `contentlayer`. Run `pnpm build` after frontmatter changes. |
| **Node runtime** | Redis/Postgres routes must keep `export const runtime = "nodejs"`. |
| **Never throw** | `/api/stats` and `/api/weather` are explicitly written to always return JSON. Keep it that way — the hero and the intro depend on it. |
| **MacGet** | Lives in its own repo and deployment. Link `https://macget.suryansh.work`, never a relative `/macget` path. |
| **`scripts/`** | Gitignored, local-only authoring tooling. Nothing deployed reads it. |
| **Tests** | There are none. `pnpm build` plus a look at `pnpm dev` is the verification loop. |

Design specs and plans for the larger changes live in `docs/superpowers/`:

- `specs/2026-07-10-portfolio-redesign-design.md`
- `specs/2026-07-12-blog-platform-upgrade-design.md`
- `specs/2026-07-23-recognition-intro-design.md`
- `specs/2026-07-26-gemini-content-scripts-design.md`

---

## License

[MIT](./LICENSE). The license file still carries the original copyright line
(`Copyright (c) 2023 Andreas Thomas`) — this project began from
[chronark.com](https://github.com/chronark/chronark.com) and has since been rewritten around
Contentlayer, the blog platform, and the recognition intro.

Code is free to reuse under MIT. The written content in `content/blog/`, the cover art in
`public/blog/`, and the personal imagery are not — please don't redeploy this as your own portfolio.

---

<div align="center">

**Building in public** — [suryansh.work](https://suryansh.work) ·
[X](https://x.com/Suryansh_2001) ·
[GitHub](https://github.com/Suryansh-Codes2209) ·
[LinkedIn](https://www.linkedin.com/in/suryansh-chaudhary-2209/)

</div>
