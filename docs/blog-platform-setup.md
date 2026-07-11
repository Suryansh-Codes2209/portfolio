# Blog platform — setup & deploy

The blog now has anonymous likes, an email subscribe flow, and automatic
new-post notifications. Everything degrades gracefully: if an env var group is
missing, that feature quietly disables itself.

## Services (all free tier)

| Feature | Service | Env vars |
|---|---|---|
| Likes | Upstash Redis (TCP `rediss://` endpoint) | `REDIS_URL`, `LIKE_SALT` |
| Subscribers | Supabase Postgres | `DATABASE_URL` |
| Email | Resend (verified domain `suryansh.work`) | `RESEND_API_KEY`, `RESEND_FROM`, `RESEND_REPLY_TO` |
| Notify cron | Vercel Cron | `CRON_SECRET` |
| Links in emails | — | `NEXT_PUBLIC_SITE_URL` |

Local values live in `.env.local` (gitignored). `.env.example` is the committed
template — never put real secrets in it.

## Deploy to Vercel

1. In the Vercel project → **Settings → Environment Variables**, add every var
   from `.env.example` with the real values (the same ones in your `.env.local`),
   for the Production environment.
   - Set `NEXT_PUBLIC_SITE_URL=https://suryansh.work` (this builds the confirm /
     unsubscribe / post links in emails — must be the real domain, not localhost).
   - `LIKE_SALT` and `CRON_SECRET`: any long random strings.
2. Push the branch and open a PR, or merge to `main`. Vercel builds automatically.
3. `vercel.json` registers a Cron hitting `/api/notify` every 30 min. Vercel sends
   `Authorization: Bearer $CRON_SECRET` automatically — no extra wiring.

## How new-post notifications work

- Publishing = commit an MDX file with `published: true` and push. Vercel rebuilds.
- The cron calls `/api/notify`, which diffs published slugs against a Redis set.
- **First run seeds the set with all existing posts and sends nothing**, so your
  back catalogue never emails anyone. Only posts published *after* that first run
  trigger a broadcast to confirmed subscribers.
- To trigger manually: `GET /api/notify?secret=$CRON_SECRET`.

## The subscriber table

Auto-created on first subscribe (`subscribers` table). Schema:
`id, email (unique), status (pending|confirmed|unsubscribed), token, created_at,
confirmed_at`. Double opt-in: subscribe → confirmation email → `/api/confirm` flips
to `confirmed`. Every email carries a one-click `/api/unsubscribe` link.

## Security — rotate the shared credentials

These were shared in chat during setup; rotate them and update `.env.local` +
Vercel:
- Resend API key (Resend dashboard)
- Supabase DB password (Supabase → Database Settings)
- Upstash Redis password (Upstash console)

## Local dev

`pnpm dev` reads `.env.local`. Note the confirm/unsubscribe links in locally-sent
emails point at `NEXT_PUBLIC_SITE_URL`; set it to your dev URL if you want to click
them locally, otherwise leave it as the production domain.
