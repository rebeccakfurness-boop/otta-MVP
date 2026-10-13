import { buildApplicationPdf } from "@/lib/forms/building-application-pdf";
import { buildingApplication } from "@/content/building-application";
import { getApplication } from "@/lib/applications/store";
import { findBrokerage } from "@/lib/portal/data";
import { readSession } from "@/lib/portal/session";

export async function GET(_request: Request, ctx: RouteContext<"/portal/applications/[id]/pdf">) {
  const session = await readSession();
  if (!session) return new Response("Please sign in again.", { status: 401 });
  const { id } = await ctx.params;
  const app = await getApplication(id, session.brokerageId);
  if (!app) return new Response("Not found", { status: 404 });
  const brokerage = await findBrokerage(app.brokerageId);
  const pdf = await buildApplicationPdf(app.answers, {
    reference: app.reference,
    brokerage: brokerage?.name,
    completedBy: app.source,
    submittedBy: app.source === "client" ? `Completed by ${app.submittedBy} for ${app.brokerName}` : app.brokerName,
  });
  return new Response(Buffer.from(pdf), {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `attachment; filename="${buildingApplication.fileName}-${app.reference}.pdf"`,
      "cache-control": "no-store",
    },
  });
}
