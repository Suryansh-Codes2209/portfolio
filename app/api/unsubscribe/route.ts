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
    return resultPage({ title: "Invalid link", body: "This unsubscribe link is malformed." });
  }

  try {
    await sql`
      update subscribers set status = 'unsubscribed'
        where token = ${token}::uuid
    `;
    return resultPage({
      title: "Unsubscribed",
      body: "You won't receive any more emails. You can resubscribe anytime.",
      href: SITE_URL,
    });
  } catch {
    return resultPage({ title: "Something went wrong", body: "Please try the link again." });
  }
}
