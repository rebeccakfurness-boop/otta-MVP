import { getForm } from "@/content/forms";
import { readAdminSession } from "@/lib/admin/session";
import { getApplication } from "@/lib/applications/store";
import { formPdfResponse } from "@/lib/forms/pdf-response";

export async function GET(_request: Request, ctx: RouteContext<"/admin/applications/[id]/pdf">) {
  if (!(await readAdminSession())) return new Response("Please sign in again.", { status: 401 });
  const app = await getApplication((await ctx.params).id);
  const form = getForm(app?.form);
  if (!app || !form) return new Response("Not found", { status: 404 });
  return formPdfResponse(form, app.answers, { reference: app.reference, completedBy: app.source, submittedBy: app.brokerName });
}
