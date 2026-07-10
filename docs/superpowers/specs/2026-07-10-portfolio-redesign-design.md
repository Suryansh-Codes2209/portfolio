# Portfolio Redesign + Blog/SEO Engine — Design

**Date:** 2026-07-10
**Owner:** Suryansh Chaudhary
**Status:** Draft for review

## Goal

Turn the portfolio from a "clever hobby project" into a professional build-in-public
presence that (a) converts recruiters/clients, (b) grows organic traffic through a real
blog+SEO engine, (c) has genuine design "wow" factor, and (d) makes daily/regular blogging
frictionless. Keep the playful builder personality throughout.

Grounded in trend research (2025–2026): bento grids, editorial + monospace typography,
dark-mode-first token systems, subtle grain, one clear hero CTA, real proof over fake logos,
and "consistency beats volume" for blogging. Motion-for-motion's-sake and gated gimmicky
intros are out.

## Decisions (locked with user)

1. **Scope:** Full visual overhaul (new typography scale, layout system, spacing, hero).
2. **Hero:** Dribbble reference is *inspiration only*. Build a hero that defines Suryansh —
   oversized-name centerpiece pattern, availability pill, one primary CTA, social rail — but
   anchored in **real build-in-public proof** (GitHub stars, MacGet downloads) instead of a
   fake "Trusted by brands" logo row.
3. **Tone:** Keep the playful builder edge ("Deployed at 3am", "Paired with Claude").
4. **Priorities (all):** SEO & blog engine, recruiter/client conversion, design wow, daily-blog habit.
5. **Blog domain:** Stays on `suryansh.work/blog` (subdirectory = best SEO, the stated priority).
   `blogs.suryansh.work` can later 301-redirect there at the DNS level — **no code cost, out of scope here.**

## Non-Goals (YAGNI)

- No WebGL/3D/Spline hero (kills LCP; wrong tradeoff for a perf-conscious dev brand).
- No blog CMS/database — Contentlayer MDX stays.
- No separate blog deployment or subdomain routing (decision 5).
- No comment system, newsletter platform, or view-count analytics rebuild.
- No kinetic/animated typography everywhere — at most one hero headline treatment.

---

## Work Breakdown

### Phase 1 — Remove the gimmicks (deletions, bundle win)

- **fahhh sound:** Strip all Web Audio code from `app/components/hero-intro.tsx`
  (`AudioContext`, buffer decode, gesture-priming `unlock`, boom `src.start`). Delete
  `public/sounds/fahhh.mp3`. The boom **flash** visual can stay (silent).
- **Hand-scroll / MediaPipe:** Delete `app/components/gesture-scroll.tsx`, remove its usage
  in `app/page.tsx` (nav `<GestureScroll />`), delete `public/sounds/fuckyou.mp3`, and remove
  `@mediapipe/tasks-vision` from `package.json`. Remove now-empty `public/sounds/` if nothing
  else uses it.
- **Terminal intro:** Keep `HeroIntro` but make it (a) fast, (b) skippable via a visible
  "skip" affordance + any keypress/click, (c) never re-shown in a session (already uses
  `sessionStorage`). Update CLAUDE.md's Sounds section to reflect the removal.
- **Update CLAUDE.md** to drop the fahhh/Web-Audio and gesture-scroll documentation.

### Phase 2 — Design system foundation

- **Design tokens:** Introduce CSS custom properties in `app/global.css` for surface/text/
  border/accent, dark-first, so component states are systematic (not ad-hoc zinc-800 literals).
  Keep the `claude` orange scale as the accent; define semantic tokens
  (`--bg`, `--surface`, `--border`, `--text`, `--text-muted`, `--accent`).
- **Typography:** Add a **monospace** family (e.g. self-hosted Geist Mono or JetBrains Mono via
  `next/font`) exposed as `--font-mono` / Tailwind `font-mono`, used for eyebrows, labels,
  metadata, code-adjacent UI. Keep CalSans for display headings; consider bumping the display
  scale. Establish a clear type scale (display / h2 / body / meta).
- **Texture:** Add a single low-opacity grain/noise overlay (SVG or tiled PNG data-URI) at the
  page root. Reduce the many blur-orb backgrounds to a restrained few (perf + focus).
- **Motion discipline:** Keep Framer fade-ups but ensure `prefers-reduced-motion` is honored
  everywhere; no new decorative motion.

### Phase 3 — Hero rebuild

New hero anatomy (replaces current photo-centered hero in `app/page.tsx`):

- **Availability pill** — "Available for work" / "Building in public" (live dot).
- **Oversized name** — "Suryansh Chaudhary" (or "Suryansh") as the editorial centerpiece.
  Keep a *small* avatar as a personal accent (hybrid), not a large centered photo.
- **One-line ship-focused tagline** — ~8–10 words, benefit-led. E.g. "I build in public —
  shipping MacGet and AI systems." Keep the typing-role as a secondary flourish (optional).
- **Single primary CTA** — "Let's build something" / "Get in touch" → `#contact`. Weak
  secondary → "View work" `#projects`. (Research: one clear CTA beats competing CTAs.)
- **Social rail** — vertical GitHub / X / LinkedIn / Email icons (desktop side rail or inline).
- **Real proof row** (replaces fake logos): GitHub stars + MacGet downloads, fetched at build
  time. See Phase 5.

### Phase 4 — Bento layout + section polish

- **`#now` and Projects** move to a **bento grid**: one dominant tile (MacGet flagship) + smaller
  supporting tiles, varied sizes, clear hierarchy. Keep existing content/copy.
- **Section eyebrows** switch to monospace, tightened spacing, consistent rhythm.
- Keep About / Stack / Recommendations / Resume / Contact sections; restyle to the new tokens
  and type scale. Trim redundant blur orbs.

### Phase 5 — Blog + SEO engine (additive; baseline already good)

Already present: `metadataBase`, `title.template`, `Person` JSON-LD, `sitemap.ts`, `robots.ts`,
per-post `generateMetadata`. **Gaps to fill:**

- **Dynamic OG cards** — per-post 1200×630 image via `next/og` `ImageResponse` at
  `app/blog/[slug]/opengraph-image.tsx` (title + tag + brand). Replaces the static `/og.png`
  fallback for posts. Wire the generated URL into existing `generateMetadata`.
- **`Article` JSON-LD** — server-rendered inline on `app/blog/[slug]/page.tsx`
  (`headline`, `datePublished`, `dateModified`, `author`, `mainEntityOfPage`, `image`).
  Escape `<` as `<` in the JSON string.
- **RSS feed** — `app/rss.xml/route.ts` (or `feed.xml`) generated from `allBlogs`, linked in
  `<head>` via `alternates.types`.
- **`llms.txt`** — static `public/llms.txt` (or route) summarizing who/what for AI-Overview
  citations.
- **Sitemap accuracy** — use post `dateModified`/`date` for `lastModified` (already partly done).

### Phase 6 — Daily-blog workflow (frictionless posting)

- Lean on the existing **`build-log` skill** + `/build-log` flow. Add a **post template** and a
  short "how I blog" note (cadence target: 2–4 strong posts/month; "publish when it's real",
  not daily filler — research shows consistency > volume).
- Ensure a new MDX file in `content/blog/` with correct frontmatter is the *only* step needed
  (Contentlayer already handles the rest). Optionally add a blog-index redesign matching the
  new type system.
- Format gotcha: this repo uses 2-space indent, NOT Rome's tabs, for new/edited TS files
  (per project memory).

---

## Architecture / Isolation notes

- **`app/page.tsx` is large (~900 lines).** As part of the hero + bento work, extract the hero,
  the `#now` bento, and the section data arrays into focused components under
  `app/components/` (e.g. `hero.tsx`, `now-bento.tsx`) so each unit is understandable and
  editable in isolation. Don't refactor unrelated sections beyond restyling.
- **Proof-fetching** lives in one place (a build-time async helper, e.g. `app/data/stats.ts`)
  with graceful fallback (static numbers) if the GitHub/GitHub-releases API is unavailable, so
  a failed fetch never breaks the build or the hero.
- **Design tokens** are the single source of truth for color/spacing; components reference
  tokens, not raw hex/zinc literals, going forward.

## Testing / Verification

No test suite in this project. Verify by:
- `pnpm build` succeeds (Contentlayer + Next) with no type errors.
- Manual: hero renders with proof numbers (or fallbacks); intro is fast + skippable; no console
  errors; `@mediapipe` fully gone from the bundle (`pnpm why @mediapipe/tasks-vision` empty).
- SEO: `/rss.xml`, `/sitemap.xml`, `/llms.txt`, and a post's `opengraph-image` all return 200;
  validate `Article` JSON-LD in Google Rich Results Test; check OG card renders in a card
  previewer.
- Lighthouse: LCP/CLS not regressed vs. current (static hero, self-hosted fonts).

## Rollout

Single feature branch off `main`. Phases land as reviewable commits in order (deletions →
tokens → hero → bento → SEO → workflow). Merge when `pnpm build` is green and hero/blog verified.
