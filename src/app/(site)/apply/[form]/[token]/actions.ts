"use server";

import { openLink } from "@/lib/applications/client-link";
import { deliverApplication } from "@/lib/applications/deliver";
import { getLink } from "@/lib/applications/store";
import { portalUrl } from "@/lib/applications/urls";
import { getForm } from "@/content/forms";
import { answersFromFormData, validate, type SubmitState } from "@/lib/forms/application";

/** A client submitting the application from a broker's link. */
export async function submitClientApplication(token: string, _prev: SubmitState, formData: FormData): Promise<SubmitState> {
  const link = await openLink(token);
  const form = getForm(link?.form);
  if (!link || !form) return { status: "error", message: "This link has expired. Please ask your broker for a new one." };
  if ((await getLink(link.id))?.completedAt) {
    return { status: "error", message: "This application has already been submitted. Please contact your broker if something needs changing." };
  }
  const answers = answersFromFormData(formData);
  const errors = validate(form, answers);
  if (Object.keys(errors).length > 0) return { status: "invalid", errors };

  try {
    const base = await portalUrl("/applications");
    const sent = await deliverApplication({
      form,
      answers,
      source: "client",
      brokerageId: link.brokerageId,
      brokerageName: link.brokerageName,
      brokerName: link.brokerName,
      brokerEmail: link.brokerEmail,
      submittedBy: answers.signatoryName || link.clientName,
      submittedByEmail: answers.email || link.clientEmail || "",
      linkId: link.id,
      portalUrl: (id) => `${base}/${id}`,
    });
    // The client doesn't get a portal link.
    return { status: "sent", reference: sent.reference, emailed: sent.emailed, emailFailed: sent.emailFailed };
  } catch (error) {
    console.error("[client-application] send failed", error);
    return { status: "error", message: "We couldn't send your application just now. Please try again in a moment." };
  }
}
