# Blog Platform Upgrade — Design

Date: 2026-07-12
Branch: `feat/blog-platform-upgrade`

## Goal

Turn the blog from a static Contentlayer list into a more professional, engaging
experience: a redesigned index + post UI, anonymous post likes, and an email
subscribe flow that notifies readers when a new post ships.

## Explicitly out of scope

- **Web push / browser notifications** — dropped (the "Allow notifications" prompt
  reads as spammy; ~5% opt-in). RSS + email cover "notify me on new posts".
- **"Follow" as a social feature** — no follower graph, profiles, or counts. The
  personal-blog equivalent is email subscribe. UI label: "Get new build logs in
  your inbox".
- **Reader accounts / auth** — likes are anonymous (IP+UA hash dedup).
- **Search palette** — deferred until > 25 posts.

## Stack

| Concern | Service | Notes |
|---|---|---|
| Likes | Upstash Redis | atomic `INCR`, `SET NX` dedup, `@upstash/ratelimit` |
| Subscribers | Supabase (Postgres) | already in the owner's workflow |
| Email | Resend | confirmation + new-post broadcast |
| RSS | existing `/rss.xml` | surfaced in UI, no change |
| Host | Vercel | Cron triggers new-post notify |

All services have free tiers. **Every integration degrades gracefully**: if the
relevant env vars are absent, the feature disables itself (likes hidden, subscribe
returns a friendly error) and the site still builds and runs.

## Env vars

```
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=      # server-only; used by API routes
RESEND_API_KEY=
RESEND_FROM="Suryansh <hello@suryansh.work>"
NEXT_PUBLIC_SITE_URL=https://suryansh.work
CRON_SECRET=                    # protects /api/notify
LIKE_SALT=                      # per-deploy salt for the visitor hash
```

## Stage 1 — UI foundation (no external services)

- `reading-progress.tsx` — fixed top bar, `useScroll` → `scaleX` (reduced-motion safe).
- Post table of contents — sticky `xl:` sidebar with IntersectionObserver scroll-spy,
  `<details>` disclosure on mobile. Headings read from the rendered `article`.
- `share-actions.tsx` — "Share on X" intent + "Copy link" with copied confirmation.
- `author-bit.tsx` — avatar, name, one-line bio, GitHub/X links.
- Related posts — pure function scoring shared-tag overlap over `allBlogs`, top 3.
- Blog index — tag filter pills (client filter + framer `layout` reflow), stronger
  featured hero, year-grouped rows, inline subscribe CTA.
- MDX callouts — `Callout` component (info/success/warning/error) in the mdx mapper.
- Copy-code button + language label on `pre` blocks (client `Pre` wrapper).
- Prose tuning — ~18px body, line-height 1.7, CalSans on prose headings,
  `scroll-mt-24`, inline-code chip, link underline offset. Via tailwind typography config.

## Stage 2 — Likes (Upstash Redis)

- `lib/redis.ts` — Upstash client factory, null when unconfigured.
- `lib/visitor.ts` — `sha256(ip + ua + LIKE_SALT)`; real IP from Vercel header.
- `app/api/likes/[slug]/route.ts`:
  - `GET` → `{ count, liked }` (liked = this visitor already in the dedup set).
  - `POST` → ratelimit guard (10/min/IP); `SET like:{slug}:{hash} 1 NX`; on success
    `INCR post:{slug}:likes`; return new count. Idempotent per visitor.
- `like-button.tsx` — optimistic heart with burst particles + count tick
  (framer-motion), localStorage mirror for instant state, reduced-motion safe.
  Hidden entirely when the API reports likes are unconfigured.

## Stage 3 — Email subscribe + new-post notify

- Supabase table `subscribers(id uuid, email text unique, status text, token uuid,
  created_at timestamptz)` — status ∈ pending | confirmed | unsubscribed.
- `app/api/subscribe` (POST) → validate email, upsert `pending`, send Resend
  double-opt-in confirmation with a `/api/confirm?token=` link.
- `app/api/confirm` (GET) → flip token to `confirmed`, render a small success page.
- `app/api/unsubscribe` (GET) → flip to `unsubscribed`; linked in every email.
- `app/api/notify` (GET, `Authorization: Bearer CRON_SECRET`) → diff published
  slugs against a Redis `notified` set; for each new post, Resend-broadcast to all
  `confirmed` subscribers, then mark notified. Safe against redeploys.
- `subscribe-form.tsx` — idle/loading/success/error states, RSS link beside it.
- `vercel.json` — Cron hitting `/api/notify` (e.g. every 30 min).

## Publish flow

`git push` → Vercel build → Cron calls `/api/notify` → new `published: true` slugs
that aren't in the Redis `notified` set trigger one broadcast each → marked notified.
No CMS/webhook needed; git push is the publish event.

## Build order

1. Stage 1 (UI) — ships visible value with zero credentials.
2. Stage 2 (likes).
3. Stage 3 (email + notify).
4. `.env.example` + setup checklist + verify build.
