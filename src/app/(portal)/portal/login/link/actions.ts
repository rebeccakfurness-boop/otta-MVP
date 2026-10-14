"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { onboarding } from "@/content/onboarding";
import { portalUrl } from "@/lib/applications/urls";
import { sendEmail } from "@/lib/email";
import { findUserByEmail } from "@/lib/portal/data";
import { createSignInLink } from "@/lib/portal/sign-in-links";

export type LinkRequestState = { sent?: string; error?: string };

const recent = new Map<string, number[]>();

/** Emails a one-time sign-in link. Always answers the same way, so it can't be used to find accounts. */
export async function requestSignInLink(_prev: LinkRequestState, formData: FormData): Promise<LinkRequestState> {
  const parsed = z.email().max(200).safeParse(String(formData.get("email") ?? "").trim());
  if (!parsed.success) return { error: "Enter the email address you use for the portal." };
  const email = parsed.data.toLowerCase();

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0].trim() ?? "local";
  const now = Date.now();
  const key = `${email}|${ip}`;
  const hits = (recent.get(key) ?? []).filter((t) => now - t < 15 * 60_000);
  if (hits.length >= 3) return { error: "We've already sent you a few links. Please check your inbox, or wait 15 minutes." };
  hits.push(now);
  recent.set(key, hits);

  const user = await findUserByEmail(email);
  if (user) {
    try {
      const token = await createSignInLink("magic", user.id);
      const url = await portalUrl(`/auth/link?token=${encodeURIComponent(token)}`);
      const message = onboarding.emails.magic({ name: user.name, url });
      await sendEmail({ to: user.email, senderName: "Otta Broker Portal", subject: message.subject, text: message.text });
    } catch (error) {
      console.error("[sign-in-link] could not send", error);
    }
  }
  return { sent: email };
}
