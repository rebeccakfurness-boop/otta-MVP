import { getForm } from "@/content/forms";
import { getApplication } from "@/lib/applications/store";
import { formPdfResponse } from "@/lib/forms/pdf-response";
import { findBrokerage } from "@/lib/portal/data";
import { readSession } from "@/lib/portal/session";

export async function GET(_request: Request, ctx: RouteContext<"/portal/applications/[id]/pdf">) {
  const session = await readSession();
  if (!session) return new Response("Please sign in again.", { status: 401 });
  const app = await getApplication((await ctx.params).id, session.brokerageId);
  const form = getForm(app?.form);
  if (!app || !form) return new Response("Not found", { status: 404 });
  const brokerage = await findBrokerage(app.brokerageId);
  return formPdfResponse(form, app.answers, {
    reference: app.reference,
    brokerage: brokerage?.name,
    completedBy: app.source,
    submittedBy: app.source === "client" ? `Completed by ${app.submittedBy} for ${app.brokerName}` : app.brokerName,
  });
}
