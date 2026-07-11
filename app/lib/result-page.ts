/**
 * Tiny standalone HTML response for the confirm/unsubscribe landing pages.
 * Self-contained (inline styles) and theme-neutral so it renders anywhere.
 */
export function resultPage({
  title,
  body,
  href,
  cta = "Back to site",
}: {
  title: string;
  body: string;
  href?: string;
  cta?: string;
}) {
  const link = href
    ? `<a href="${href}" style="display:inline-block;margin-top:24px;background:#D97757;color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:11px 22px;border-radius:10px;">${cta}</a>`
    : "";

  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="robots" content="noindex"/>
<title>${title}</title></head>
<body style="margin:0;background:#08070a;color:#f5f4f2;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;">
    <div style="max-width:420px;text-align:center;">
      <h1 style="font-size:26px;margin:0 0 12px;">${title}</h1>
      <p style="color:#b4b1ab;font-size:15px;line-height:1.6;margin:0;">${body}</p>
      ${link}
    </div>
  </div>
</body></html>`;

  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } });
}
