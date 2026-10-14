import { formBySlug } from "@/content/forms";
import { answersFromFormData } from "@/lib/forms/application";
import { formPdfResponse } from "@/lib/forms/pdf-response";
import { findBrokerage } from "@/lib/portal/data";
import { readSession } from "@/lib/portal/session";

// Turns whatever has been filled in so far into the branded PDF. An empty
// form downloads as a blank form for printing.
export async function POST(request: Request, ctx: RouteContext<"/portal/forms/[form]/pdf">) {
  const session = await readSession();
  if (!session) return new Response("Please sign in again.", { status: 401 });
  const form = formBySlug((await ctx.params).form);
  if (!form) return new Response("Not found", { status: 404 });
  const brokerage = await findBrokerage(session.brokerageId);
  return formPdfResponse(form, answersFromFormData(await request.formData()), { brokerage: brokerage?.name });
}
