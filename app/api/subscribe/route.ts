import { type NextRequest, NextResponse } from "next/server";
import { ensureSchema } from "@/app/lib/db";
import { FROM, REPLY_TO, SITE_URL, getResend } from "@/app/lib/resend";
import { confirmEmail } from "@/app/lib/emails";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  let email = "";
  try {
    const body = await req.json();
    email = String(body.email ?? "").trim().toLowerCase();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const sql = await ensureSchema();
  const resend = getResend();
  if (!sql || !resend) {
    return NextResponse.json(
      { error: "Subscriptions aren't configured yet." },
      { status: 503 },
    );
  }

  try {
    const rows = await sql`
      insert into subscribers (email) values (${email})
      on conflict (email) do update set
        status = case when subscribers.status = 'unsubscribed' then 'pending' else subscribers.status end
      returning email, token, status
    `;
    const sub = rows[0];

    if (sub.status === "confirmed") {
      return NextResponse.json({ ok: true, message: "You're already subscribed 🎉" });
    }

    const confirmUrl = `${SITE_URL}/api/confirm?token=${sub.token}`;
    const { subject, html, text } = confirmEmail(confirmUrl);
    const { error } = await resend.emails.send({
      from: FROM,
      to: email,
      subject,
      html,
      text,
      ...(REPLY_TO ? { replyTo: REPLY_TO } : {}),
    });
    if (error) {
      console.error("resend send error", error);
      return NextResponse.json(
        { error: "Couldn't send the confirmation email. Try again shortly." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, message: "Check your inbox to confirm." });
  } catch (err) {
    console.error("subscribe error", err);
    return NextResponse.json({ error: "Something went wrong. Try again." }, { status: 500 });
  }
}
