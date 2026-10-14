import { getForm } from "@/content/forms";
import { openLink } from "@/lib/applications/client-link";
import { answersFromFormData } from "@/lib/forms/application";
import { formPdfResponse } from "@/lib/forms/pdf-response";

// The client's own copy of what they have filled in so far (or a blank form).
export async function POST(request: Request, ctx: RouteContext<"/apply/[form]/[token]/pdf">) {
  const link = await openLink((await ctx.params).token);
  const form = getForm(link?.form);
  if (!link || !form) return new Response("This link has expired.", { status: 401 });
  return formPdfResponse(form, answersFromFormData(await request.formData()), { brokerage: link.brokerageName, completedBy: "client" });
}
