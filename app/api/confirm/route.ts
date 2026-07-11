import type { NextRequest } from "next/server";
import { getSql } from "@/app/lib/db";
import { SITE_URL } from "@/app/lib/resend";
import { resultPage } from "@/app/lib/result-page";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const sql = getSql();

  if (!token || !sql) {
    return resultPage({
      title: "Invalid link",
      body: "This confirmation link is missing or malformed.",
    });
  }

  try {
    const rows = await sql`
      update subscribers
        set status = 'confirmed', confirmed_at = now()
        where token = ${token}::uuid and status = 'pending'
        returning email
    `;
    if (rows.length === 0) {
      return resultPage({
        title: "Already confirmed",
        body: "This subscription is already active, or the link has expired.",
        href: SITE_URL,
      });
    }
    return resultPage({
      title: "You're in 🎉",
      body: "Thanks for subscribing — you'll get an email whenever a new build log ships.",
      href: `${SITE_URL}/blog`,
      cta: "Read the blog",
    });
  } catch {
    return resultPage({ title: "Something went wrong", body: "Please try the link again." });
  }
}
