import "server-only";
import { env } from "./env";

type Email = {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
  senderName?: string;
  attachments?: { name: string; content: Uint8Array }[];
};

/**
 * Sends a transactional email through Brevo. Without BREVO_API_KEY (local
 * development and preview builds) the email is logged instead of sent.
 * Returns whether it was actually sent.
 */
export async function sendEmail({ to, subject, text, replyTo, senderName = "Otta website", attachments }: Email) {
  if (!env.brevoApiKey) {
    console.info("[email:dev] would send", { to, subject, text, attachments: attachments?.map((a) => a.name) });
    return false;
  }
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": env.brevoApiKey, "content-type": "application/json" },
    body: JSON.stringify({
      sender: { email: env.enquiryFromEmail, name: senderName },
      to: [{ email: to }],
      replyTo: replyTo ? { email: replyTo } : undefined,
      subject,
      textContent: text,
      attachment: attachments?.map((a) => ({ name: a.name, content: Buffer.from(a.content).toString("base64") })),
    }),
  });
  if (!res.ok) throw new Error(`Brevo responded ${res.status}`);
  return true;
}
