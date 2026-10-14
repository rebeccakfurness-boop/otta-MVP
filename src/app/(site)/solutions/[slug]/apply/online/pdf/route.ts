import { applicationFormFor } from "@/content/forms";
import { answersFromFormData, HONEYPOT_FIELD, withContact } from "@/lib/forms/application";
import { formPdfResponse } from "@/lib/forms/pdf-response";

// The applicant's own copy of what they have filled in so far (or a blank form).
export async function POST(request: Request, ctx: RouteContext<"/solutions/[slug]/apply/online/pdf">) {
  const form = applicationFormFor((await ctx.params).slug);
  if (!form) return new Response("Not found", { status: 404 });
  const answers = answersFromFormData(await request.formData());
  delete answers[HONEYPOT_FIELD];
  return formPdfResponse(withContact(form), answers, { completedBy: "public" });
}
