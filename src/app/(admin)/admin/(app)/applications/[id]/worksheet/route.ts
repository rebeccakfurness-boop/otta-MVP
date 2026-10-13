import { brokerageNames } from "@/lib/admin/data";
import { readAdminSession } from "@/lib/admin/session";
import { getApplication } from "@/lib/applications/store";
import { buildWorksheet } from "@/lib/uw/worksheet";

// The pre-filled underwriting worksheet for an application (Otta staff only).
export async function GET(_request: Request, ctx: RouteContext<"/admin/applications/[id]/worksheet">) {
  if (!(await readAdminSession())) return new Response("Please sign in again.", { status: 401 });
  const app = await getApplication((await ctx.params).id);
  if (!app) return new Response("Not found", { status: 404 });
  const names = await brokerageNames();
  const file = await buildWorksheet(app.answers, {
    reference: app.reference,
    brokerageName: names[app.brokerageId] ?? app.brokerageId,
    brokerName: app.brokerName,
    createdAt: app.createdAt,
  });
  return new Response(Buffer.from(file.content), {
    headers: {
      "content-type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "content-disposition": `attachment; filename="${file.name}"`,
      "cache-control": "no-store",
    },
  });
}
