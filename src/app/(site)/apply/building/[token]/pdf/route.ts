import { buildingApplication } from "@/content/building-application";
import { openLink } from "@/lib/applications/client-link";
import { buildApplicationPdf } from "@/lib/forms/building-application-pdf";
import { answersFromFormData } from "@/lib/forms/building-application";

// The client's own copy of what they have filled in so far (or a blank form).
export async function POST(request: Request, ctx: RouteContext<"/apply/building/[token]/pdf">) {
  const link = await openLink((await ctx.params).token);
  if (!link) return new Response("This link has expired.", { status: 401 });
  const answers = answersFromFormData(await request.formData());
  const reference = /^OTT-BA-[\w-]{1,20}$/.test(answers.reference ?? "") ? answers.reference : undefined;
  delete answers.reference;
  const pdf = await buildApplicationPdf(answers, { reference, brokerage: link.brokerageName, completedBy: "client" });
  return new Response(Buffer.from(pdf), {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `attachment; filename="${buildingApplication.fileName}.pdf"`,
      "cache-control": "no-store",
    },
  });
}
