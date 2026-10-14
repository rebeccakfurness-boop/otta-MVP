"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { onboarding } from "@/content/onboarding";
import { adminUrl } from "@/lib/applications/urls";
import { sendEmail } from "@/lib/email";
import { env } from "@/lib/env";
import { emailDomain, FREE_EMAIL, saveAccessRequest } from "@/lib/portal/accounts";
import { findBrokerageByDomain, findUserByEmail } from "@/lib/portal/data";

export type JoinState = {
  done?: { matched?: string };
  existing?: boolean;
  error?: string;
  errors?: Record<string, string>;
  values?: Record<string, string>;
};

const schema = z.object({
  name: z.string().trim().min(2, "Enter your full name.").max(120),
  email: z.email("Enter your work email address.").max(200),
  phone: z.string().trim().min(6, "Enter a phone number we can reach you on.").max(40),
  role: z.enum(onboarding.join.roles as [string, ...string[]], "Choose your role."),
  brokerageName: z.string().trim().min(2, "Enter your brokerage's name.").max(160),
  fspNumber: z.string().trim().max(20).optional(),
  message: z.string().trim().max(1000).optional(),
});

const recent = new Map<string, number[]>();

/** A broker asks for a portal account. The Otta team approves it in the admin portal. */
export async function requestAccess(_prev: JoinState, formData: FormData): Promise<JoinState> {
  const values = Object.fromEntries(
    ["name", "email", "phone", "role", "brokerageName", "fspNumber", "message"].map((k) => [k, String(formData.get(k) ?? "").trim()]),
  );
  // Spam trap: hidden from people, filled in by bots.
  if (formData.get("company_website")) return { done: {} };

  const parsed = schema.safeParse({ ...values, fspNumber: values.fspNumber || undefined, message: values.message || undefined });
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) errors[String(issue.path[0])] ??= issue.message;
    return { errors, values };
  }
  const data = { ...parsed.data, email: parsed.data.email.toLowerCase() };

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0].trim() ?? "local";
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < 60 * 60_000);
  if (hits.length >= 5) return { error: "We've had a few requests from you already. Please try again later, or email us.", values };
  hits.push(now);
  recent.set(ip, hits);

  if (await findUserByEmail(data.email)) return { existing: true, values };

  const domain = emailDomain(data.email);
  const matched = FREE_EMAIL.test(data.email) ? null : await findBrokerageByDomain(domain);
  const id = `req-${crypto.randomUUID().slice(0, 8)}`;
  await saveAccessRequest({
    id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    role: data.role,
    brokerageName: data.brokerageName,
    fspNumber: data.fspNumber,
    message: data.message,
    matchedBrokerageId: matched?.id,
    status: "pending",
    createdAt: new Date().toISOString(),
  });

  try {
    const toOtta = onboarding.emails.toOtta({
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      brokerage: data.brokerageName,
      fsp: data.fspNumber,
      message: data.message,
      matched: matched?.name,
      url: await adminUrl("/access-requests"),
    });
    await sendEmail({ to: env.brokerAccessEmail, senderName: "Otta Broker Portal", replyTo: data.email, subject: toOtta.subject, text: toOtta.text });
    const received = onboarding.emails.received({ name: data.name });
    await sendEmail({ to: data.email, senderName: "Otta Broker Portal", subject: received.subject, text: received.text });
  } catch (error) {
    console.error("[join] could not send emails", error);
  }
  return { done: { matched: matched?.name } };
}
