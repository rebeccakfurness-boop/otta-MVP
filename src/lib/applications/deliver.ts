import "server-only";
import { buildingApplication } from "@/content/building-application";
import { sendEmail } from "@/lib/email";
import { env } from "@/lib/env";
import { buildApplicationPdf } from "@/lib/forms/building-application-pdf";
import { summaryText, type Answers } from "@/lib/forms/building-application";
import { buildWorksheet, propertyLocation } from "@/lib/uw/worksheet";
import { getLink, newId, newReference, saveApplication, saveLink, type ApplicationSource } from "./store";

type Delivery = {
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
  const id = newId("app");
  const reference = newReference();
  const createdAt = new Date().toISOString();
  const viaClient = d.source === "client";

  await saveApplication({
    id,
    reference,
    brokerageId: d.brokerageId,
    source: d.source,
    submittedBy: d.submittedBy,
    submittedByEmail: d.submittedByEmail,
    brokerName: d.brokerName,
    brokerEmail: d.brokerEmail,
    insuredName: d.answers.insuredName ?? "",
    propertyAddress: d.answers.propertyAddress ?? "",
    linkId: d.linkId,
    answers: d.answers,
    createdAt,
  });
  if (d.linkId) {
    const link = await getLink(d.linkId);
    if (link) await saveLink({ ...link, completedAt: createdAt, applicationId: id });
  }

  const pdf = await buildApplicationPdf(d.answers, {
    reference,
    brokerage: d.brokerageName,
    completedBy: d.source,
    submittedBy: viaClient ? `Completed by ${d.submittedBy} for ${d.brokerName}` : `${d.brokerName} (${d.brokerEmail})`,
  });
  const attachment = { name: `${buildingApplication.fileName}-${reference}.pdf`, content: pdf };
  // Only the Otta team gets the pre-filled underwriting worksheet.
  const worksheet = await buildWorksheet(d.answers, {
    reference,
    brokerageName: d.brokerageName,
    brokerName: d.brokerName,
    createdAt,
  }).catch((error) => {
    console.error("[uw-worksheet] could not build", error);
    return null;
  });
  const location = propertyLocation(d.answers);
  const floodLines = [
    `FLOOD MAPPING`,
    `  Property: ${d.answers.propertyAddress}${location.region ? ` (${location.region})` : ""}`,
    `  Complete flood map (national): ${location.flood.national.url}`,
    `  ${location.region || "Regional"} flood map: ${location.flood.regional.name}`,
    `  ${location.flood.regional.url}`,
  ];
  const subject = `Building insurance application: ${d.answers.insuredName}, ${d.answers.propertyAddress} (${reference})`;

  const emailed = await sendEmail({
    to: env.applicationToEmail,
    replyTo: d.brokerEmail,
    senderName: "Otta Broker Portal",
    subject,
    text: [
      viaClient
        ? `A building insurance application was completed by ${d.submittedBy} using a link from their broker.`
        : `A new building insurance application was submitted through the Otta Broker Portal.`,
      ``,
      `Reference: ${reference}`,
      `Brokerage: ${d.brokerageName}`,
      `Broker: ${d.brokerName} (${d.brokerEmail})`,
      viaClient ? `Completed by: ${d.submittedBy} (${d.submittedByEmail})` : ``,
      ``,
      worksheet
        ? `The completed form is attached as a PDF, with the underwriting worksheet pre-filled (Excel). Reply to this email to contact the broker.`
        : `The completed form is attached as a PDF. Reply to this email to contact the broker.`,
      ``,
      ...floodLines,
      ``,
      summaryText(d.answers),
    ]
      .filter((l, i, all) => !(l === "" && all[i - 1] === ""))
      .join("\n"),
    attachments: worksheet ? [attachment, worksheet] : [attachment],
  });

  if (viaClient) {
    await sendEmail({
      to: d.brokerEmail,
      senderName: "Otta Broker Portal",
      subject: `Your client completed their building insurance application (${reference})`,
      text: [
        `Kia ora ${d.brokerName.split(" ")[0]},`,
        ``,
        `${d.submittedBy} has completed the building insurance application you sent them, for ${d.answers.propertyAddress}.`,
        `It has gone straight to the Otta property team and is saved in your broker portal${d.portalUrl ? `: ${d.portalUrl(id)}` : "."}`,
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
