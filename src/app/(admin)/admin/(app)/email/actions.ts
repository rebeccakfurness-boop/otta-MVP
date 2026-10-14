"use server";

import { readAdminSession } from "@/lib/admin/session";
import { sendEmail } from "@/lib/email";
import { env } from "@/lib/env";

export type TestEmailState = {
  result?: "sent" | "not-sent" | "failed";
  detail?: string;
  to?: string;
};

/** Sends a test email through the same path as every other email, and reports exactly what happened. */
export async function sendTestEmail(
  _prev: TestEmailState,
  formData: FormData,
): Promise<TestEmailState> {
  const admin = await readAdminSession();
  if (!admin) return { result: "failed", detail: "Please sign in again." };
  const to = String(formData.get("to") ?? "").trim() || admin.email;
  try {
    const sent = await sendEmail({
      to,
      senderName: "Otta email check",
      subject: "Otta email check",
      text: `This is a test email from the Otta admin portal, sent by ${admin.name} at ${new Date().toISOString()}.\n\nIf you're reading this, email sending works.`,
    });
    const delivered =
      env.emailDemoTo && to.toLowerCase() !== env.emailDemoTo.toLowerCase()
        ? env.emailDemoTo
        : to;
    return sent
      ? {
          result: "sent",
          to: delivered,
          detail: `Brevo accepted it. Check ${delivered} (and its junk folder) in a minute or two.`,
        }
      : {
          result: "not-sent",
          detail:
            "BREVO_API_KEY isn't set on this deployment, so the email was only logged, not sent.",
        };
  } catch (error) {
    return {
      result: "failed",
      detail: error instanceof Error ? error.message : String(error),
    };
  }
}
