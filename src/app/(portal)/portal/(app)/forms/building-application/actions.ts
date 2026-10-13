"use server";

import { buildingApplication } from "@/content/building-application";
import { sendEmail } from "@/lib/email";
import { env } from "@/lib/env";
import { buildApplicationPdf } from "@/lib/forms/building-application-pdf";
import { answersFromFormData, summaryText, validate, type Errors } from "@/lib/forms/building-application";
import { requireBroker } from "@/lib/portal/auth";

export type SubmitState =
  | { status: "idle" }
  | { status: "invalid"; errors: Errors }
  | { status: "error"; message: string }
  | { status: "sent"; reference: string; emailed: boolean };

function newReference() {
  const d = new Date();
  const stamp = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  return `OTT-BA-${stamp}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export async function submitBuildingApplication(_prev: SubmitState, formData: FormData): Promise<SubmitState> {
  const broker = await requireBroker();
  const answers = answersFromFormData(formData);
  const errors = validate(answers);
  if (Object.keys(errors).length > 0) return { status: "invalid", errors };

  const reference = newReference();
  try {
    const pdf = await buildApplicationPdf(answers, {
      reference,
      brokerage: broker.brokerageName,
      submittedBy: `${broker.name} (${broker.email})`,
    });
    const emailed = await sendEmail({
      to: env.applicationToEmail,
      replyTo: broker.email,
      senderName: "Otta Broker Portal",
      subject: `Building insurance application: ${answers.insuredName}, ${answers.propertyAddress} (${reference})`,
      text: [
        `A new building insurance application was submitted through the Otta Broker Portal.`,
        ``,
        `Reference: ${reference}`,
        `Brokerage: ${broker.brokerageName}`,
        `Submitted by: ${broker.name} (${broker.email})`,
        ``,
        `The completed form is attached as a PDF. Reply to this email to contact the broker.`,
        ``,
        summaryText(answers),
      ].join("\n"),
      attachments: [{ name: `${buildingApplication.fileName}-${reference}.pdf`, content: pdf }],
    });
    return { status: "sent", reference, emailed };
  } catch (error) {
    console.error("[building-application] send failed", error);
    return {
      status: "error",
      message: "We couldn't send the application just now. Please try again, or download the PDF and email it to the Otta team.",
    };
  }
}
