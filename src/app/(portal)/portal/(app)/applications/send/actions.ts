"use server";

import { z } from "zod";
import { getForm } from "@/content/forms";
import { LINK_DAYS, sealLink } from "@/lib/applications/client-link";
import { newId, saveLink } from "@/lib/applications/store";
import { websiteUrl } from "@/lib/applications/urls";
import { sendEmail } from "@/lib/email";
import { requireBroker } from "@/lib/portal/auth";

export type LinkState =
  | { status: "idle" }
  | { status: "invalid"; errors: Record<string, string>; values: Record<string, string> }
  | { status: "created"; url: string; formTitle: string; clientName: string; clientEmail?: string; emailed: boolean; emailRequested: boolean; emailError?: boolean };

const schema = z.object({
  form: z.string().refine((id) => !!getForm(id), "Choose a form"),
  clientName: z.string().trim().min(1, "Enter your client's name").max(120),
  clientEmail: z.union([z.literal(""), z.email("Enter a valid email address")]),
  note: z.string().trim().max(1000),
  sendEmail: z.string().optional(),
});

export async function createClientLink(_prev: LinkState, formData: FormData): Promise<LinkState> {
  const broker = await requireBroker();
  const raw = {
    form: String(formData.get("form") ?? ""),
    clientName: String(formData.get("clientName") ?? ""),
    clientEmail: String(formData.get("clientEmail") ?? "").trim(),
    note: String(formData.get("note") ?? ""),
    sendEmail: formData.get("sendEmail") ? "on" : undefined,
  };
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) errors[String(issue.path[0])] ??= issue.message;
    return { status: "invalid", errors, values: { ...raw, sendEmail: raw.sendEmail ?? "" } };
  }
  const d = parsed.data;
  const form = getForm(d.form)!;

  const id = newId("lnk");
  const now = new Date();
  const token = await sealLink({
    id,
    form: form.id,
    brokerageId: broker.brokerageId,
    brokerageName: broker.brokerageName,
    brokerName: broker.name,
    brokerEmail: broker.email,
    clientName: d.clientName,
    clientEmail: d.clientEmail || undefined,
  });
  const url = await websiteUrl(`/apply/${form.id}/${encodeURIComponent(token)}`);
  await saveLink({
    id,
    form: form.id,
    brokerageId: broker.brokerageId,
    brokerName: broker.name,
    brokerEmail: broker.email,
    clientName: d.clientName,
    clientEmail: d.clientEmail || undefined,
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + LINK_DAYS * 86_400_000).toISOString(),
    url,
  });

  let emailed = false;
  let emailError = false;
  if (d.sendEmail && d.clientEmail) {
    try {
      emailed = await sendEmail({
        to: d.clientEmail,
        replyTo: broker.email,
        senderName: `${broker.name} via Otta`,
        subject: form.invite.subject(broker.brokerageName),
        text: form.invite.body({
          clientName: d.clientName,
          brokerName: broker.name,
          brokerage: broker.brokerageName,
          url,
          days: LINK_DAYS,
          note: d.note || undefined,
        }),
      });
    } catch (error) {
      console.error("[client-link] email failed", error);
      emailError = true;
    }
  }
  return { status: "created", url, formTitle: form.shortTitle, clientName: d.clientName, clientEmail: d.clientEmail || undefined, emailed, emailRequested: !!(d.sendEmail && d.clientEmail), emailError };
}
