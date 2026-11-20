import { SITE } from "@/lib/data";

interface Email {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function sendEmail({ to, subject, html, replyTo }: Email) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    console.info(`[correo omitido: falta RESEND_API_KEY o RESEND_FROM_EMAIL] ${subject} -> ${to}`);
    return false;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: `${SITE.name} <${from}>`,
        to,
        subject,
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });
    if (!response.ok) {
      console.error("Resend rechazó el correo:", response.status, await response.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error("No se pudo enviar el correo:", error);
    return false;
  }
}

export function emailLayout(title: string, body: string) {
  return `<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#2b2036">
  <h1 style="font-size:22px;margin:0 0 16px">${escapeHtml(title)}</h1>
  ${body}
  <p style="margin-top:32px;font-size:12px;color:#6c5c78">${escapeHtml(SITE.name)}: ${escapeHtml(SITE.tagline)}</p>
</div>`;
}
