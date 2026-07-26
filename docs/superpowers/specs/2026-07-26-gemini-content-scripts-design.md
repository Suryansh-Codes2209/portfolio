# Gemini content scripts: post drafting + sketch covers

**Date:** 2026-07-26
**Status:** approved

## Problem

Two gaps in the build-log workflow:

1. Drafting a post from scratch is the friction that stops posts from happening. The
   `/build-log` skill helps inside Claude Code, but there's no standalone way to go from
   "I shipped X this week" to a draft `.mdx` on disk.
2. The `image` field exists in `contentlayer.config.js` but only one post sets it
   (`building-macget-download-engine.mdx` → `/macget-og.png`), and **nothing in the app
   renders it**. Posts have no cover art anywhere — index, post header, or OG.

## Scope

- Two local-only Node scripts driven by Gemini, run by hand, never committed.
- Backfill covers for the 7 published posts that lack one.
- Wire `post.image` into the blog index and post page so covers are actually visible.

Out of scope: automatic publishing, CI/cron integration, image CDN, editing existing prose.

## Architecture

### `scripts/` — gitignored

```
scripts/
  lib/gemini.mjs    shared: env loader, text + image calls, frontmatter I/O
  gen-post.mjs      topic string + git context -> draft .mdx
  gen-image.mjs     slug (or --backfill) -> cover png + frontmatter update
  README.md         usage, local only
```

Plain Node ESM (`.mjs`), Node 22, global `fetch`, **zero npm dependencies**. Adding deps
would write entries into the committed `package.json` for code that isn't in the repo.

`package.json` is not modified for the same reason: an npm script pointing at a gitignored
file is a broken command for anyone who clones the repo. Invocation is `node scripts/…`.

`.gitignore` gains `/scripts/`. `.env.local` is already ignored.

### `lib/gemini.mjs`

| Export | Behavior |
|---|---|
| `loadEnv()` | Parses `.env.local` into `process.env` (skips comments/blank lines, strips quotes). Throws a clear message if `GEMINI_API_KEY` is missing. |
| `generateText(prompt, {model, temperature})` | POST `:generateContent`. Default model `gemini-3.5-flash`. Throws on non-200 with the API's error body. |
| `generateImage(prompt, {model})` | POST `:generateContent` against an image model (default `gemini-3-pro-image`), returns the first `inlineData` part as a Buffer. |
| `readFrontmatter(file)` / `writeFrontmatter(file, patch)` | Split on the leading `---` fences, parse the flat `key: value` subset actually used by this blog, patch keys in place preserving order and body bytes. |

The frontmatter parser is deliberately minimal — this blog's frontmatter is flat scalars
plus one string array (`tags`). No YAML dependency.

### `gen-post.mjs`

```
node scripts/gen-post.mjs "topic or one-line pitch" [--slug x] [--force] [--tags a,b]
```

Grounding assembled before the model call:

- `git log -20 --pretty=…` plus `--stat`, and the diff summary of the last few commits.
- Titles + tags of all existing posts, so the draft doesn't duplicate a published topic.
- `content/blog/_TEMPLATE.mdx.txt` as the structural target.

Output: `content/blog/<slug>.mdx` with `published: false` (never auto-publishes), a
computed `readingTime` (words / 220, rounded up), and the build-log voice — first person,
one concrete decision, a "what I'd do differently" section, the X sign-off. Refuses to
overwrite an existing slug without `--force`.

### `gen-image.mjs`

```
node scripts/gen-image.mjs <slug>       # one post
node scripts/gen-image.mjs --backfill   # all published posts missing `image:`
node scripts/gen-image.mjs <slug> --force
```

Per post: reads title/description/tags, builds a prompt, calls `gemini-3-pro-image`,
writes `public/blog/<slug>.png`, then patches that post's frontmatter with
`image: "/blog/<slug>.png"`.

`--backfill` runs sequentially with a delay between calls, skips posts that already have
`image:` unless `--force`, and reports a per-post pass/fail summary. One failure does not
abort the run.

### Cover art direction

Hand-drawn **whiteboard architecture sketch**:

- Dark ground matching the site (`#0a0a0a`-ish), chalky off-white marker strokes.
- Loose, wobbly, imperfect lines — boxes, arrows, nodes, brackets, callout marks.
  Deliberately not vector-clean.
- One focal element in the `claude` orange accent; everything else monochrome.
- **3–6 short hand-printed labels**, drawn from the post's real technical vocabulary.
  Everything else — body copy inside boxes, margin notes — stays illegible squiggle.
- 16:9, subject matter derived from the post's actual topic (agent graphs, chunked
  downloads, gate layers, …) rather than generic tech clip-art.

Revised during implementation. The first pass banned legible text outright, on the
assumption that image models garble words. `gemini-3-pro-image` ignored the ban on 4 of 7
covers and spelled correctly when it did — so the constraint produced an inconsistent set
rather than a text-free one. Two artefacts made the original rule untenable: one cover
rendered the literal word "annotation" (prompt wording leaking into the art) and another
garbled a second word into "Ungune". Allowing accurate labels and explicitly banning
meta-words ("annotation", "label", "sketch", "diagram", …) fixed both. Anyone changing
this preamble must regenerate the whole set with `--force`, or the index will look like
two different blogs.

Consistency across the set comes from a fixed style preamble; variety comes from the
per-post subject clause.

## App changes (committed)

`app/blog/[slug]/page.tsx`
- Cover renders between the header block and the mobile actions bar: 16:9,
  `rounded-xl border border-line`, `next/image` with `fill` + `sizes`, priority load.
- `post.image` feeds `openGraph.images`; JSON-LD `image` prefers it, falling back to the
  existing generated `/blog/<slug>/opengraph-image`.

`app/blog/page.tsx`
- Featured card: cover above the "Latest" label, 16:9, inside the existing bordered card.
- List rows: small 16:9 thumbnail on the right, `sm:` and up only.

Both are conditional on `post.image` — posts without one render exactly as they do today.

## Error handling

- Missing `GEMINI_API_KEY` → single-line error naming `.env.local`, exit 1.
- Non-200 from Gemini → print status + response body, exit 1 (single) or mark that post
  failed and continue (backfill).
- Image response with no `inlineData` part (safety block, text-only reply) → report the
  returned `finishReason`/text so the cause is visible.
- Existing file collisions require `--force`; no silent overwrites.

## Verification

No test suite in this project. Verification is:

1. `node scripts/gen-image.mjs <one-slug>` → PNG exists, frontmatter patched.
2. `pnpm build` → contentlayer regenerates, no type errors.
3. `pnpm dev` → cover visible on `/blog` and on the post page, and posts without a cover
   still render.
4. `git status` shows `scripts/` untracked-and-ignored.
