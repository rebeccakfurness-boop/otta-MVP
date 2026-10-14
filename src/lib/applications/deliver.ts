import "server-only";
import { after } from "next/server";
import type { FormDefinition } from "@/content/forms";
import { sendEmail } from "@/lib/email";
import { env } from "@/lib/env";
import { keyName, summaryText, type Answers } from "@/lib/forms/application";
import { buildApplicationPdf } from "@/lib/forms/application-pdf";
import { generateBrief } from "@/lib/uw/brief";
import { buildWorksheet, propertyLocation } from "@/lib/uw/worksheet";
import { getLink, newId, newReference, saveApplication, saveLink, type Application, type ApplicationSource } from "./store";
import { adminUrl } from "./urls";

type Delivery = {
  form: FormDefinition;
  answers: Answers;
  source: ApplicationSource;
  brokerageId: string;
  brokerageName: string;
  brokerName: string;
  brokerEmail: string;
  /** Who filled it in: the broker, or the client. */
  submittedBy: string;
  submittedByEmail: string;
  linkId?: string;
  /** Link to the application in the broker portal, for the broker's email. */
  portalUrl?: (id: string) => string;
};

/**
 * Sends a completed application to Otta: saves it to the broker's portal,
 * emails it with the PDF attached, and tells the broker when their client
 * completed it.
 */
export async function deliverApplication(d: Delivery) {
  const { form } = d;
  const id = newId("app");
  const reference = newReference({ building: "BA", "corporate-travel": "CT", "landlord-protect": "LP", "no-claims-declaration": "ND", "professional-indemnity": "PI", "pa-group": "PG", "pa-individual": "PA", "pa-health": "HD", "pa-claim": "CL", "travel-claim": "TC", accountants: "AQ", "pi-renewal": "PR" }[form.id] ?? "AP");
  const name = keyName(form, d.answers);
  const detail = d.answers[form.keyFields.detail] ?? "";
  const noun = form.shortTitle.toLowerCase();
  const createdAt = new Date().toISOString();
  const viaClient = d.source === "client";

  const application: Application = {
    id,
    form: form.id,
    reference,
    brokerageId: d.brokerageId,
    source: d.source,
    submittedBy: d.submittedBy,
    submittedByEmail: d.submittedByEmail,
    brokerName: d.brokerName,
    brokerEmail: d.brokerEmail,
    insuredName: name,
    propertyAddress: detail,
    linkId: d.linkId,
    answers: d.answers,
    createdAt,
  };
  await saveApplication(application);
  // Building applications: the underwriting assistant writes its brief in the
  // background, ready for the underwriter in the admin portal.
  if (form.underwriting) {
    after(() => generateBrief(application).catch((error) => console.error("[uw-brief] failed", error)));
  }
  if (d.linkId) {
    const link = await getLink(d.linkId);
    if (link) await saveLink({ ...link, completedAt: createdAt, applicationId: id });
  }

  const pdf = await buildApplicationPdf(form, d.answers, {
    reference,
    brokerage: d.brokerageName,
    completedBy: d.source,
    submittedBy:
      d.source === "public"
        ? `Direct application from ${d.submittedBy}`
        : viaClient
          ? `Completed by ${d.submittedBy} for ${d.brokerName}`
          : `${d.brokerName} (${d.brokerEmail})`,
  });
  const attachment = { name: `${form.fileName}-${reference}.pdf`, content: pdf };
  // Building applications only: the Otta team also gets the pre-filled
  // underwriting worksheet and flood map links for the property.
  const worksheet = form.underwriting
    ? await buildWorksheet(d.answers, { reference, brokerageName: d.brokerageName, brokerName: d.brokerName, createdAt }).catch((error) => {
        console.error("[uw-worksheet] could not build", error);
        return null;
      })
    : null;
  let floodLines: string[] = [];
  if (form.underwriting) {
    const location = propertyLocation(d.answers);
    floodLines = [
      `UNDERWRITING ASSISTANT`,
      `  The AI brief (red flags, missing information, a draft email to the broker) and copy-and-paste blocks for the V13 worksheet:`,
      `  ${await adminUrl(`/applications/${id}`)}`,
      `  Rating region: ${location.rating.region || "not found, choose it on the worksheet"}`,
      ``,
      `FLOOD MAPPING`,
      `  Property: ${detail}${location.region ? ` (${location.region})` : ""}`,
      `  Complete flood map (national): ${location.flood.national.url}`,
      `  ${location.rating.region || location.region || "Regional"} flood map: ${location.flood.regional.name}`,
      `  ${location.flood.regional.url}`,
      ...location.flood.more.map((m) => `  Also: ${m.name}: ${m.url}`),
      ...(location.flood.unavailable ? [`  No council flood mapping for this area: ask how the property performed in flood events over the last five years.`] : []),
      ``,
    ];
  }
  const subject = `${form.shortTitle}: ${name}${detail ? `, ${detail}` : ""} (${reference})`;

  const direct = d.source === "public";
  const contact = direct ? "the applicant" : "the broker";
  const emailed = await sendEmail({
    to: env.applicationToEmail || form.teamEmail,
    replyTo: d.brokerEmail,
    senderName: direct ? "Otta website" : "Otta Broker Portal",
    subject: direct ? `Direct application: ${subject}` : subject,
    text: [
      direct
        ? `A ${noun} was submitted directly on the Otta website (no broker).`
        : viaClient
          ? `A ${noun} was completed by ${d.submittedBy} using a link from their broker.`
          : `A new ${noun} was submitted through the Otta Broker Portal.`,
      ``,
      `Reference: ${reference}`,
      ...(direct
        ? [`Applicant: ${d.submittedBy} (${d.submittedByEmail})`, d.answers.contactPhone ? `Phone: ${d.answers.contactPhone}` : ``]
        : [`Brokerage: ${d.brokerageName}`, `Broker: ${d.brokerName} (${d.brokerEmail})`]),
      viaClient ? `Completed by: ${d.submittedBy} (${d.submittedByEmail})` : ``,
      ``,
      worksheet
        ? `The completed form is attached as a PDF, with the underwriting worksheet pre-filled (Excel). Reply to this email to contact ${contact}.`
        : `The completed form is attached as a PDF. Reply to this email to contact ${contact}.`,
      ``,
      ...floodLines,
      summaryText(form, d.answers),
    ]
      .filter((l, i, all) => !(l === "" && all[i - 1] === ""))
      .join("\n"),
    attachments: worksheet ? [attachment, worksheet] : [attachment],
  });

  if (viaClient) {
    await sendEmail({
      to: d.brokerEmail,
      senderName: "Otta Broker Portal",
      subject: `Your client completed their ${noun} (${reference})`,
      text: [
        `Kia ora ${d.brokerName.split(" ")[0]},`,
        ``,
        `${d.submittedBy} has completed the ${noun} you sent them${detail ? `, for ${detail}` : ""}.`,
        `It has gone straight to ${form.sendTo} and is saved in your broker portal${d.portalUrl ? `: ${d.portalUrl(id)}` : "."}`,
        ``,
        `Reference: ${reference}`,
        ``,
        `A copy of the form is attached.`,
        ``,
        `The Otta team`,
      ].join("\n"),
      attachments: [attachment],
    });
  }

  return { id, reference, emailed };
}
