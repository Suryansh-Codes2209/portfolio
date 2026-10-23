# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm fmt        # Rome lint+format. WARNING: reformats the whole repo 2-space → tabs.
                # Committed code is 2-space — never commit a repo-wide `pnpm fmt` pass.
```

There are no tests in this project.

```bash
pnpm video:studio   # Remotion Studio — preview/edit the explainer scenes
pnpm video:render   # render out/portfolio-explainer{,-vertical}.mp4 (16:9 + 9:16)
pnpm video:still    # re-render the poster stills in public/video/posters/
```

Remotion CLI commands pass `--port=3311` because port 3000 is usually taken by `next dev`.

## Architecture

**Project data — static:** Projects live as a typed array in `app/data/projects.ts` (no MDX, no Redis, no view counts). Edit that file to add/remove projects.

**Blog content — Contentlayer:** Blog posts are MDX files in `content/blog/` processed by `contentlayer.config.js` (uses the `contentlayer2` fork aliased as `contentlayer` for Next 14 compatibility). Only posts with `published: true` are listed. Imported as `allBlogs` from `"contentlayer/generated"`.

**Routing:** `/` is a single-page "Vox explainer" (hero, now, about, stack, projects, recommendations, blog, resume, contact). `app/page.tsx` is a thin server component; each chapter lives in `app/components/sections/*` (stack is `tech-stack.tsx`, hero is `hero.tsx`). Standalone routes: `/about` (entity page), `/skills`, `/projects`, `/blog`, `/contact`. The top nav links to the real pages; anchors are only used where no page exists (`#now`, `#resume`).

**New routes need their own `layout.tsx`** exporting `metadata` with `alternates.canonical`. Without one they inherit the root layout's canonical, which points at the homepage, and Google drops them as duplicates.

**Shared chrome:** `page-nav.tsx` (header + cross-page links) and `site-footer.tsx` (internal link row) are used by every standalone route (the blog index included; post pages keep their own header). The footer link row is the crawl path for those pages — don't remove it.

**Shared facts:** `app/data/site.ts` holds URLs, socials, `sameAs`, and product links used by metadata, JSON-LD and page copy at once. Edit facts there, not in three places.

**Journey board (home only):** `app/components/vox/journey-board.tsx` lays the home chapters out as full-screen panels on a 2D board and turns scrolling into a camera pan in a snake (right → down → left → down). Panels taller than the screen are read top-to-bottom before the pan; scrolling that stops mid-pan finishes the pan in the direction you were scrolling (never back — custom rAF tween, cancelled by any wheel/touch/key input), and the camera eases toward the scroll position instead of tracking it 1:1; in-page `#anchors` are intercepted and mapped to panels. It only activates at `lg`+ without reduced motion — otherwise the same markup stacks normally. Because panels move with transforms, don't use `position: sticky` or scroll-linked `useScroll({ target })` inside home chapters (use in-view triggers), and keep the page wrapper `overflow-x-clip` (not `-hidden`, which breaks the sticky viewport).

**Hero (proof-driven):** `hero.tsx` is a client component. It renders immediately with zero stats, then `useEffect`-fetches `/api/stats` and fills in GitHub stars / MacGet downloads once the response lands — there's no server-rendered stats path. `app/api/stats/route.ts` (`revalidate: 3600`) calls `getProofStats()` in `app/data/stats.ts`, which hits the GitHub API for the MacGet repo (stars, release download counts) and never throws — a failed/rate-limited fetch falls back to the last known counts (set `GITHUB_TOKEN` in prod to avoid rate limits) so the route always returns JSON.

**Now section:** `now-bento.tsx` renders the `#now` section as a static bento grid of sticky notes (current focus, build-log writing, AI agent work) — no data fetching, just curated copy.

**Design tokens ("Vox edit"):** Light theme is "Newsprint", dark is "Darkroom". Use Tailwind classes like `border-line`, `bg-surface`, `bg-highlight`/`text-highlight-ink`, `shadow-paper`, `font-serif` (Instrument Serif — headlines), `font-mono` (JetBrains Mono — captions/stamps) rather than hardcoding the values from `global.css`. `global.css` also defines the `.paper`, `.tape`, `.marker`, `.halftone`, `.ruled`, `.torn-bottom` utilities.

**Vox primitives:** `app/components/vox/` — `Highlight` (marker swipe), `Annotate` (red-pen circle/underline/arrow), `Cutout` (sticker photo), `TapedCard` (+ `tiltFor` stable tilt), `Stamp`, `KineticHeading`, `Chapter` (numbered section shell), `RemotionClip` (lazy Player), `ExplainerModal`.

**21st.dev / shadcn:** `components.json` + `cn()` in `app/lib/utils.ts` are set up for `pnpm dlx shadcn@latest add "https://21st.dev/r/<author>/<name>?api_key=$API_KEY_21ST"` (21st.dev installs need an API key). The current `app/components/ui/*` (marquee, number-ticker, bento-grid, timeline, expandable-card) are hand-ports of the MIT Magic UI / Aceternity originals, restyled to the tokens — keep the credit comments.

**Remotion video:** `video/` (not `remotion/` — tsconfig's `baseUrl: "."` would shadow the `remotion` package). `video/scenes/*` are seven frame-driven scenes built from `video/primitives/*` with inline styles only (no Tailwind) and the palette in `video/theme.ts`; `video/explainer.tsx` chains them with page-turn transitions; `video/Root.tsx` registers 16:9 and 9:16 versions and fills GitHub stats via `getProofStats()` at render time. Scenes read the same data files as the site (`app/data/{site,projects,stack,experience,recommendations}.ts`), so edit facts there. Scene lengths live in the import-free `video/durations.ts` so the site can read them without pulling in the video bundle. The site embeds scenes through `app/components/vox/clips.tsx` (dynamic, `ssr:false`, muted autoplay); keep `remotion` and every `@remotion/*` package on the same exact version.

**Blog SEO:** Each post page (`app/blog/[slug]/page.tsx`) emits a single `BlogPosting` JSON-LD `<script>` block (not `Article`). The blog stays on `suryansh.work/blog` — this redesign didn't move or rename routes.

## Blogging cadence

Target 2–4 focused posts/month. Copy `content/blog/_TEMPLATE.mdx.txt` to `content/blog/{slug}.mdx` and set `published: true`. Use the `/build-log` skill to draft a post from recent work.
