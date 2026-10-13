import "server-only";
import { env } from "./env";

type Email = { to: string; subject: string; text: string; replyTo?: string };

/**
 * Sends a transactional email through Brevo. Without BREVO_API_KEY (local
 * development and preview builds) the email is logged instead of sent.
 */
export async function sendEmail({ to, subject, text, replyTo }: Email) {
  if (!env.brevoApiKey) {
    console.info("[email:dev] would send", { to, subject, text });
    return;
  }
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": env.brevoApiKey, "content-type": "application/json" },
    body: JSON.stringify({
      sender: { email: env.enquiryFromEmail, name: "Otta website" },
      to: [{ email: to }],
      replyTo: replyTo ? { email: replyTo } : undefined,
      subject,
      textContent: text,
    }),
  });
  if (!res.ok) throw new Error(`Brevo responded ${res.status}`);
}
