import { formBySlug, onlineForms } from "@/content/forms";
import { buildApplicationPdf } from "@/lib/forms/application-pdf";

// Blank, Otta-branded PDFs of the online forms, for the website's Resources
// pages: /downloads/corporate-travel-proposal.pdf. Built once at deploy time.

export function generateStaticParams() {
  return onlineForms.map((f) => ({ file: `${f.slug}.pdf` }));
}

export async function GET(_request: Request, ctx: RouteContext<"/downloads/[file]">) {
  const form = formBySlug((await ctx.params).file.replace(/\.pdf$/, ""));
  if (!form) return new Response("Not found", { status: 404 });
  const pdf = await buildApplicationPdf(form, {});
  return new Response(Buffer.from(pdf), {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `inline; filename="${form.fileName}.pdf"`,
    },
  });
}
