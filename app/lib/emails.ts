/**
 * Plain-HTML email templates (no extra deps). Kept simple and inline-styled for
 * broad email-client support. Accent = Claude orange (#D97757).
 */

const ACCENT = "#D97757";
const shell = (inner: string) => `
<div style="background:#f4f2ee;padding:32px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid #e7e2da;border-radius:16px;overflow:hidden;">
    <div style="padding:28px 32px;">
      ${inner}
    </div>
  </div>
  <p style="max-width:520px;margin:16px auto 0;padding:0 32px;color:#a8a29e;font-size:12px;line-height:1.6;">
    You're receiving this because you subscribed at suryansh.work.
  </p>
</div>`;

const button = (href: string, label: string) => `
  <a href="${href}" style="display:inline-block;background:${ACCENT};color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;padding:11px 20px;border-radius:10px;">${label}</a>`;

export function confirmEmail(confirmUrl: string) {
  return {
    subject: "Confirm your subscription",
    text: `Confirm your subscription to Suryansh's build logs: ${confirmUrl}`,
    html: shell(`
      <p style="margin:0 0 6px;color:${ACCENT};font-size:12px;letter-spacing:1px;text-transform:uppercase;font-weight:600;">One more step</p>
      <h1 style="margin:0 0 12px;font-size:22px;color:#1c1a17;">Confirm your subscription</h1>
      <p style="margin:0 0 20px;color:#57534e;font-size:15px;line-height:1.6;">
        Tap below to confirm you'd like to get new build logs from Suryansh by email — the engineering, the trade-offs, and what broke along the way.
      </p>
      ${button(confirmUrl, "Confirm subscription")}
      <p style="margin:20px 0 0;color:#a8a29e;font-size:12px;line-height:1.6;">If you didn't request this, just ignore this email.</p>
    `),
  };
}

export function newPostEmail(opts: {
  title: string;
  description: string;
  url: string;
  unsubscribeUrl: string;
}) {
  return {
    subject: `New build log: ${opts.title}`,
    text: `${opts.title}\n\n${opts.description}\n\nRead it: ${opts.url}\n\nUnsubscribe: ${opts.unsubscribeUrl}`,
    html: shell(`
      <p style="margin:0 0 6px;color:${ACCENT};font-size:12px;letter-spacing:1px;text-transform:uppercase;font-weight:600;">New build log</p>
      <h1 style="margin:0 0 12px;font-size:22px;color:#1c1a17;line-height:1.3;">${escapeHtml(opts.title)}</h1>
      <p style="margin:0 0 22px;color:#57534e;font-size:15px;line-height:1.6;">${escapeHtml(opts.description)}</p>
      ${button(opts.url, "Read the post →")}
      <p style="margin:24px 0 0;padding-top:16px;border-top:1px solid #e7e2da;color:#a8a29e;font-size:12px;line-height:1.6;">
        <a href="${opts.unsubscribeUrl}" style="color:#a8a29e;">Unsubscribe</a>
      </p>
    `),
  };
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
