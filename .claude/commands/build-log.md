---
description: Draft a new build-log blog post in content/blog from your recent work
argument-hint: <topic or project, e.g. "macget signed auto-updates">
---

You are writing a **build-log blog post** for Suryansh's portfolio (`content/blog/*.mdx`,
processed by Contentlayer). The topic is: **$ARGUMENTS**

Write in Suryansh's voice: first-person, concrete, honest about trade-offs. These posts double as
build-in-public content — they should prove real engineering, not read like a generic tutorial.

## Step 1 — Gather real context (don't invent)

Ground the post in what actually happened. Before writing, pull context from:

1. Recent work in this repo:
   - `git log --oneline -15`
   - `git diff HEAD~5 --stat` (and read the interesting diffs)
2. If the topic names another project/repo (e.g. MacGet), read whatever source is available here —
   `app/macget/page.tsx`, `app/data/projects.ts` — for accurate feature/architecture details.
3. If you still don't have enough concrete detail (what was built, what broke, what you learned),
   **ask the user 2–3 short questions** before writing. Do not fabricate technical specifics,
   benchmarks, or APIs.

## Step 2 — Write the post

Create `content/blog/<slug>.mdx` where `<slug>` is kebab-case derived from the title.

Frontmatter contract (matches `contentlayer.config.js` — `title`/`description`/`date` are required):

```mdx
---
title: "Clear, specific, search-friendly title"
description: "1–2 sentence summary with the concrete thing built (used for SEO + cards)."
date: "YYYY-MM-DD"   # today's date
tags: ["MacGet", "Swift", "build-in-public"]   # 3–5, real tech + topic
published: true
readingTime: 6   # honest estimate in minutes
image: "/some-og.png"   # OPTIONAL — a 1200×630 social card in public/; omit to fall back to the site og.png
---
```

Body guidance:
- Lead with **why** this work mattered / the problem, not throat-clearing.
- Structure with `##` headings. A build-log shape that works:
  *the problem → what I built → what broke / the trade-off → what I learned → what's next.*
- Use **real** code snippets only — fenced and language-tagged. No invented APIs or fake numbers.
- Keep it tight (≈600–1000 words). Link related work with relative links (`/macget`) and the GitHub
  repo where relevant.
- End with a short "what's next" + an invitation (bug reports / ideas) — it's building in public.

## Step 3 — Hand off for review

After writing the file:
- Print the path and the full frontmatter.
- Give a 2–3 bullet summary of what the post claims, and **flag anything you inferred** so the user
  can verify before pushing.
- Remind the user to run `pnpm build` (regenerates Contentlayer) and review at `/blog/<slug>` before
  committing. Do **not** commit or push — the user reviews and ships it themselves.
