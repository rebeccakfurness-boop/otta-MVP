"use server";

import { headers } from "next/headers";
import { getForm } from "@/content/forms";
import { deliverApplication } from "@/lib/applications/deliver";
import { DIRECT_BROKERAGE } from "@/lib/applications/store";
import { answersFromFormData, HONEYPOT_FIELD, validate, withContact, type SubmitState } from "@/lib/forms/application";

// Best effort, per server instance: a few applications per visitor per hour.
const recent = new Map<string, number[]>();

/** Someone applying directly on the website, without a broker. */
export async function submitPublicApplication(formId: string, _prev: SubmitState, formData: FormData): Promise<SubmitState> {
  const base = getForm(formId);
  if (!base) return { status: "error", message: "This form isn't available." };
  const form = withContact(base);
  const answers = answersFromFormData(formData);

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0].trim() ?? "local";
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < 60 * 60_000);
  if (hits.length >= 5) return { status: "error", message: "We've received several applications from you already. Please call us if you need help." };

  const errors = validate(form, answers);
  if (Object.keys(errors).length > 0) return { status: "invalid", errors };
  // Bots fill in the hidden field; pretend it worked and send nothing.
  if (answers[HONEYPOT_FIELD]) return { status: "sent", reference: "OTT-RECEIVED", emailed: true };
  delete answers[HONEYPOT_FIELD];
  hits.push(now);
  recent.set(ip, hits);

  try {
    const sent = await deliverApplication({
      form,
      answers,
      source: "public",
      brokerageId: DIRECT_BROKERAGE,
      brokerageName: "Direct application (website)",
      brokerName: answers.contactName,
      brokerEmail: answers.contactEmail,
      submittedBy: answers.contactName,
      submittedByEmail: answers.contactEmail,
    });
    return { status: "sent", reference: sent.reference, emailed: sent.emailed };
  } catch (error) {
    console.error("[public-application] send failed", error);
    return { status: "error", message: "We couldn't send your application just now. Please try again in a moment." };
  }
}
