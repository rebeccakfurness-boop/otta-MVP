"use server";

import { z } from "zod";
import { getForm } from "@/content/forms";
import { LINK_DAYS, sealLink } from "@/lib/applications/client-link";
import { newId, saveLink } from "@/lib/applications/store";
import { websiteUrl } from "@/lib/applications/urls";
import { requirePlacingBroker } from "@/lib/portal/auth";

export type LinkState =
  | { status: "idle" }
  | { status: "invalid"; errors: Record<string, string>; values: Record<string, string> }
  | { status: "created"; url: string; formTitle: string; clientName: string };

const schema = z.object({
  form: z.string().refine((id) => !!getForm(id), "Choose a form"),
  clientName: z.string().trim().min(1, "Enter your client's name").max(120),
});

export async function createClientLink(_prev: LinkState, formData: FormData): Promise<LinkState> {
  const broker = await requirePlacingBroker();
  const raw = {
    form: String(formData.get("form") ?? ""),
    clientName: String(formData.get("clientName") ?? ""),
  };
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) errors[String(issue.path[0])] ??= issue.message;
    return { status: "invalid", errors, values: raw };
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
  });
  const url = await websiteUrl(`/apply/${form.id}/${encodeURIComponent(token)}`);
  await saveLink({
    id,
    form: form.id,
    brokerageId: broker.brokerageId,
    brokerName: broker.name,
    brokerEmail: broker.email,
    clientName: d.clientName,
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + LINK_DAYS * 86_400_000).toISOString(),
    url,
  });

  // Only brokers talk to their clients: Otta never emails the link, the broker sends it themselves.
  return { status: "created", url, formTitle: form.shortTitle, clientName: d.clientName };
}
