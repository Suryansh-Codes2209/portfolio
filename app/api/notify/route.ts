import { type NextRequest, NextResponse } from "next/server";
import { allBlogs } from "contentlayer/generated";
import { getRedis } from "@/app/lib/redis";
import { getSql } from "@/app/lib/db";
import { FROM, REPLY_TO, SITE_URL, getResend } from "@/app/lib/resend";
import { newPostEmail } from "@/app/lib/emails";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NOTIFIED_KEY = "notified:posts"; // Redis set of already-announced slugs
const INIT_FLAG = "notified:init"; // marks the one-time seed as done

/**
 * Cron endpoint. Announces any published post not yet in the notified set to all
 * confirmed subscribers, then records it. On the very first run it seeds the set
 * with existing posts and sends nothing, so historical posts never blast the list.
 * Auth: `Authorization: Bearer $CRON_SECRET` (Vercel Cron) or `?secret=`.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  const qsSecret = req.nextUrl.searchParams.get("secret");
  if (!secret || (auth !== `Bearer ${secret}` && qsSecret !== secret)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const redis = getRedis();
  const sql = getSql();
  const resend = getResend();
  if (!redis || !sql || !resend) {
    return NextResponse.json({ error: "notify not configured" }, { status: 503 });
  }

  const published = allBlogs.filter((p) => p.published);

  // One-time seed.
  const inited = await redis.exists(INIT_FLAG);
  if (!inited) {
    if (published.length) await redis.sadd(NOTIFIED_KEY, ...published.map((p) => p.slug));
    await redis.set(INIT_FLAG, "1");
    return NextResponse.json({ seeded: true, count: published.length, sent: 0 });
  }

  // Posts not yet announced.
  const fresh = [];
  for (const p of published) {
    if ((await redis.sismember(NOTIFIED_KEY, p.slug)) === 0) fresh.push(p);
  }
  if (fresh.length === 0) return NextResponse.json({ sent: 0, fresh: 0 });

  const subs = await sql`select email, token from subscribers where status = 'confirmed'`;

  let sent = 0;
  for (const post of fresh) {
    const url = `${SITE_URL}/blog/${post.slug}`;
    for (const s of subs) {
      const unsubscribeUrl = `${SITE_URL}/api/unsubscribe?token=${s.token}`;
      const { subject, html, text } = newPostEmail({
        title: post.title,
        description: post.description,
        url,
        unsubscribeUrl,
      });
      try {
        await resend.emails.send({
          from: FROM,
          to: s.email,
          subject,
          html,
          text,
          ...(REPLY_TO ? { replyTo: REPLY_TO } : {}),
        });
        sent++;
      } catch (e) {
        console.error("notify send failed", s.email, e);
      }
    }
    await redis.sadd(NOTIFIED_KEY, post.slug);
  }

  return NextResponse.json({ sent, fresh: fresh.length, subscribers: subs.length });
}
