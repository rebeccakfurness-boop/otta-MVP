import { brokerageNames } from "@/lib/admin/data";
import { readAdminSession } from "@/lib/admin/session";
import { getApplication } from "@/lib/applications/store";
import { getBrief, worksheetTerms } from "@/lib/uw/brief";
import { buildWorksheet } from "@/lib/uw/worksheet";

// The pre-filled underwriting worksheet for an application (Otta staff only),
// with the underwriting assistant's notes once its brief is ready.
export async function GET(_request: Request, ctx: RouteContext<"/admin/applications/[id]/worksheet">) {
  if (!(await readAdminSession())) return new Response("Please sign in again.", { status: 401 });
  const app = await getApplication((await ctx.params).id);
  if (!app) return new Response("Not found", { status: 404 });
  const [names, brief] = await Promise.all([brokerageNames(), getBrief(app.id)]);
  // Includes the underwriter's region choice and the assistant's notes, when there are any.
  const file = await buildWorksheet(
    app.answers,
    { reference: app.reference, brokerageName: names[app.brokerageId] ?? app.brokerageId, brokerName: app.brokerName, createdAt: app.createdAt },
    { ratingRegion: brief?.ratingRegion, underwriterNotes: brief?.brief?.underwriterNotes, ...worksheetTerms(brief?.brief) },
  );
  return new Response(Buffer.from(file.content), {
    headers: {
      "content-type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "content-disposition": `attachment; filename="${file.name}"`,
      "cache-control": "no-store",
    },
  });
}
