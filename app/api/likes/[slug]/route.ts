import { type NextRequest, NextResponse } from "next/server";
import { allBlogs } from "contentlayer/generated";
import { getRedis } from "@/app/lib/redis";
import { visitorHash } from "@/app/lib/visitor";

// Node runtime (ioredis needs TCP sockets, not Edge).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isKnownSlug(slug: string): boolean {
  return allBlogs.some((p) => p.slug === slug && p.published);
}

const countKey = (slug: string) => `post:${slug}:likes`;
const dedupKey = (slug: string, v: string) => `like:${slug}:${v}`;
const rateKey = (v: string) => `rl:like:${v}`;

/** GET → current like count + whether this visitor already liked. */
export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const redis = getRedis();
  if (!redis || !isKnownSlug(params.slug)) {
    return NextResponse.json({ count: 0, liked: false, enabled: !!redis });
  }

  const v = visitorHash(req);
  const [count, liked] = await Promise.all([
    redis.get(countKey(params.slug)),
    redis.exists(dedupKey(params.slug, v)),
  ]);

  return NextResponse.json({
    count: Number(count ?? 0),
    liked: liked === 1,
    enabled: true,
  });
}

/** POST → register one like per visitor (idempotent), returns the new count. */
export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const redis = getRedis();
  if (!redis) return NextResponse.json({ count: 0, liked: false, enabled: false });
  if (!isKnownSlug(params.slug)) {
    return NextResponse.json({ error: "unknown post" }, { status: 404 });
  }

  const v = visitorHash(req);

  // Fixed-window rate limit: max 20 like actions per minute per visitor.
  const rl = await redis.incr(rateKey(v));
  if (rl === 1) await redis.expire(rateKey(v), 60);
  if (rl > 20) {
    return NextResponse.json({ error: "rate limited" }, { status: 429 });
  }

  // One like per visitor: SET NX succeeds only the first time.
  const first = await redis.set(dedupKey(params.slug, v), "1", "EX", 60 * 60 * 24 * 365, "NX");

  let count: number;
  if (first === "OK") {
    count = await redis.incr(countKey(params.slug));
  } else {
    count = Number((await redis.get(countKey(params.slug))) ?? 0);
  }

  return NextResponse.json({ count, liked: true, enabled: true });
}
