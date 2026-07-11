---
description: Draft a new build-log blog post in content/blog from your recent work
argument-hint: <optional topic, e.g. "macget signed auto-updates" — omit to auto-pick a trending topic>
---

You are writing a **build-log blog post** for Suryansh's portfolio (`content/blog/*.mdx`,
processed by Contentlayer). The requested topic is: **$ARGUMENTS**

Write in Suryansh's voice: first-person, concrete, honest about trade-offs. These posts double as
build-in-public content — they should prove real engineering, not read like a generic tutorial.

Suryansh's core beats (use these to anchor topic discovery and framing): **AI systems** (LangChain,
LangGraph, agents, RAG, Vertex AI / GCP), **MacGet** (Swift macOS package manager), Next.js /
frontend, and system-design-for-AI. Stay in these lanes — a build-log has to map to real work he does.

## Step 0 — Web research (ALWAYS do this; it feeds Step 1)

Use **web search** (WebSearch) to make the post current and discoverable. Two modes:

**A. No topic given (`$ARGUMENTS` is empty or blank):** pick the topic yourself.
1. Read `content/blog/*.mdx` frontmatter to see what's already been covered — do **not** duplicate an
   existing post; find a fresh angle or an adjacent gap.
2. Web-search for what's currently trending in Suryansh's beats, e.g.
   `LangGraph 2026 trending`, `Vertex AI RAG new features`, `AI agent engineering discussions`,
   `macOS package manager Homebrew alternative`. Look for a topic that is (a) genuinely current,
   (b) something Suryansh plausibly has hands-on work in, and (c) not already a post.
3. Propose the chosen topic + angle to the user in one line before writing, so they can redirect.

**B. Topic given:** keep the topic, but enrich it.
1. Web-search the topic to confirm the latest facts, API names, versions, and any recent changes —
   so you don't write something stale or wrong.
2. Web-search for the **trending / high-intent search terms people actually use** for this topic
   (phrasings, related keywords, "vs" comparisons, common questions). Fold the strongest 2–4 of these
   naturally into the **title, description, tags, and `##` headings** for SEO — never keyword-stuff or
   let them distort the honest technical story.

Cite nothing inline in the post, but let the research shape accuracy and wording. If search is
unavailable, say so and proceed from repo + user context.

## Step 1 — Gather real context (don't invent)

Ground the post in what actually happened. Before writing, pull context from:

1. Recent work in this repo:
   - `git log --oneline -15`
   - `git diff HEAD~5 --stat` (and read the interesting diffs)
2. If the topic names another project/repo (e.g. MacGet), read whatever source is available here —
   `app/macget/page.tsx`, `app/data/projects.ts` — for accurate feature/architecture details.
3. If you still don't have enough concrete detail (what was built, what broke, what you learned),
   **ask the user 2–3 short questions** before writing. Do not fabricate technical specifics,
   benchmarks, or APIs. Web research fills in *external* facts; it does **not** license inventing
   Suryansh's personal experience — that still comes from the repo or the user.

## Step 2 — Write the post

Create `content/blog/<slug>.mdx` where `<slug>` is kebab-case derived from the title (and search-friendly).

Frontmatter contract (matches `contentlayer.config.js` — `title`/`description`/`date` are required):

```mdx
---
title: "Clear, specific, search-friendly title"
description: "1–2 sentence summary with the concrete thing built (used for SEO + cards)."
date: "YYYY-MM-DD"   # today's date
tags: ["MacGet", "Swift", "build-in-public"]   # 3–5, real tech + topic; include 1–2 trending terms from Step 0
published: true
readingTime: 6   # honest estimate in minutes
image: "/some-og.png"   # OPTIONAL — a 1200×630 social card in public/; omit to fall back to the site og.png
---
```

### Blog-writing craft (apply these)
- **Lead with the problem / why**, in the first two sentences — no "In this post I'll…" throat-clearing.
  The first line should make the stakes concrete (the failure, the cost, the thing that broke).
- **Title**: specific + search-friendly. Front-load the concrete noun ("LangGraph", "Vertex AI RAG",
  "MacGet auto-updates"). Skip clickbait; a real engineering claim outperforms hype.
- **Description**: 1–2 sentences naming the concrete thing built + the interesting decision. This is
  the SEO snippet and the card copy — make it earn a click on its own.
- **Structure** with `##` headings that read as a narrative and quietly carry keywords:
  *the problem → what I built → what broke / the trade-off → what I learned → what's next.*
- **Show real code** — fenced and language-tagged, only APIs/values that exist. No invented APIs or
  fake benchmarks. If you must use illustrative params, flag them at hand-off (Step 3).
- **Honesty over polish**: name the trade-off, what you'd do differently, what you bought vs built.
  The "what broke" section is what makes it a build-log instead of a tutorial.
- **Scannable**: short paragraphs, occasional bold takeaways, tight bullet lists. Keep it ≈600–1000
  words. Link related work with relative links (`/macget`, `/blog/<other-slug>`) and the GitHub repo.
- End with a short **"what's next"** + an invitation (bug reports / ideas) — it's building in public.
- Match the existing posts' sign-off style (e.g. the `_Building in public — follow along on X…_` line).

## Step 3 — Hand off for review

After writing the file:
- Print the path and the full frontmatter.
- Note the **topic source** (given vs auto-picked) and the **trending terms** you wove in from web research.
- Give a 2–3 bullet summary of what the post claims, and **flag anything you inferred** (including
  illustrative code params or web facts) so the user can verify before pushing.
- Remind the user to run `pnpm build` (regenerates Contentlayer) and review at `/blog/<slug>` before
  committing. Do **not** commit or push — the user reviews and ships it themselves.
