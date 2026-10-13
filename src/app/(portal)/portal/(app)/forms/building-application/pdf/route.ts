import { buildingApplication } from "@/content/building-application";
import { buildApplicationPdf } from "@/lib/forms/building-application-pdf";
import { answersFromFormData } from "@/lib/forms/building-application";
import { findBrokerage } from "@/lib/portal/data";
import { readSession } from "@/lib/portal/session";

// Turns whatever has been filled in so far into the branded PDF. An empty
// form downloads as a blank form for printing.
export async function POST(request: Request) {
  const session = await readSession();
  if (!session) return new Response("Please sign in again.", { status: 401 });
  const brokerage = await findBrokerage(session.brokerageId);
  const form = await request.formData();
  const answers = answersFromFormData(form);
  // The copy downloaded after sending carries the reference it was sent with.
  const reference = /^OTT-BA-[\w-]{1,20}$/.test(answers.reference ?? "") ? answers.reference : undefined;
  delete answers.reference;
  const pdf = await buildApplicationPdf(answers, { brokerage: brokerage?.name, reference });
  const name = answers.insuredName
    ?.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w ]/g, "")
    .trim();
  const file = `${buildingApplication.fileName}${name ? `-${name.replace(/ +/g, "-")}` : ""}.pdf`;
  return new Response(Buffer.from(pdf), {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `attachment; filename="${file}"`,
      "cache-control": "no-store",
    },
  });
}
