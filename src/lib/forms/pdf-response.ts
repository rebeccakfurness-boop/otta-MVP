import "server-only";
import type { FormDefinition } from "@/content/forms";
import type { Answers } from "./application";
import { buildApplicationPdf } from "./application-pdf";

type Meta = Parameters<typeof buildApplicationPdf>[2];

/**
 * A PDF download of a form: blank, part filled, or a sent application. A copy
 * downloaded right after sending carries its reference in `answers.reference`.
 */
export async function formPdfResponse(form: FormDefinition, answers: Answers, meta: Meta = {}) {
  const fromAnswers = /^OTT-[A-Z]{2}-[\w-]{1,20}$/.test(answers.reference ?? "") ? answers.reference : undefined;
  const { reference: _ignored, ...rest } = answers;
  void _ignored;
  const pdf = await buildApplicationPdf(form, rest, { ...meta, reference: meta.reference ?? fromAnswers });
  const name = (meta.reference ?? fromAnswers) || rest[form.keyFields.name];
  const safe = name
    ?.normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\w -]/g, "")
    .trim()
    .replace(/ +/g, "-");
  return new Response(Buffer.from(pdf), {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `attachment; filename="${form.fileName}${safe ? `-${safe}` : ""}.pdf"`,
      "cache-control": "no-store",
    },
  });
}
