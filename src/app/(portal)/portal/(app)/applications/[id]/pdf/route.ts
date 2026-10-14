import { getForm } from "@/content/forms";
import { getApplication } from "@/lib/applications/store";
import { formPdfResponse } from "@/lib/forms/pdf-response";
import { findBrokerage } from "@/lib/portal/data";
import { readBroker } from "@/lib/portal/auth";
import { canSeeApplication } from "@/lib/portal/scope";

export async function GET(_request: Request, ctx: RouteContext<"/portal/applications/[id]/pdf">) {
  const broker = await readBroker();
  if (!broker) return new Response("Please sign in again.", { status: 401 });
  const found = await getApplication((await ctx.params).id);
  const app = found && canSeeApplication(broker.scope, found) ? found : null;
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
