import { createHash } from "node:crypto";
import type { NextRequest } from "next/server";

/**
 * Derive a privacy-preserving visitor fingerprint from the request. We hash the
 * client IP + user-agent + a server-side salt, so the raw IP is never stored.
 * Coarse by design (shared NATs collapse) — the right bar for anonymous likes.
 */
export function visitorHash(req: NextRequest): string {
  // Vercel populates x-forwarded-for with the real client IP first; fall back
  // to x-real-ip. Local dev has neither, so we bucket everyone to "local".
  const fwd = req.headers.get("x-forwarded-for");
  const ip = fwd?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "local";
  const ua = req.headers.get("user-agent") ?? "unknown";
  const salt = process.env.LIKE_SALT ?? "dev-salt";

  return createHash("sha256").update(`${ip}|${ua}|${salt}`).digest("hex").slice(0, 24);
}
