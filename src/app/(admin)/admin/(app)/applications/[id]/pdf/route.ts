import { buildingApplication } from "@/content/building-application";
import { readAdminSession } from "@/lib/admin/session";
import { getApplication } from "@/lib/applications/store";
import { buildApplicationPdf } from "@/lib/forms/building-application-pdf";

export async function GET(_request: Request, ctx: RouteContext<"/admin/applications/[id]/pdf">) {
  if (!(await readAdminSession())) return new Response("Please sign in again.", { status: 401 });
  const app = await getApplication((await ctx.params).id);
  if (!app) return new Response("Not found", { status: 404 });
  const pdf = await buildApplicationPdf(app.answers, { reference: app.reference, completedBy: app.source, submittedBy: app.brokerName });
  return new Response(Buffer.from(pdf), {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `attachment; filename="${buildingApplication.fileName}-${app.reference}.pdf"`,
      "cache-control": "no-store",
    },
  });
}
