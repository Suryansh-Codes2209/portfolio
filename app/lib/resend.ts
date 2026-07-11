import { Resend } from "resend";

const globalForResend = globalThis as unknown as { resend?: Resend | null };

/** Resend client, or null when RESEND_API_KEY is unset. */
export function getResend(): Resend | null {
  if (globalForResend.resend !== undefined) return globalForResend.resend;
  const key = process.env.RESEND_API_KEY;
  globalForResend.resend = key ? new Resend(key) : null;
  return globalForResend.resend;
}

export const FROM = process.env.RESEND_FROM ?? "Suryansh <onboarding@resend.dev>";
export const REPLY_TO = process.env.RESEND_REPLY_TO;
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://suryansh.work";
