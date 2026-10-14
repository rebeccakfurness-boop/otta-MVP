import { getForm } from "@/content/forms";
import { readAdminSession } from "@/lib/admin/session";
import { getApplication } from "@/lib/applications/store";
import { withContact } from "@/lib/forms/application";
import { formPdfResponse } from "@/lib/forms/pdf-response";

export async function GET(_request: Request, ctx: RouteContext<"/admin/applications/[id]/pdf">) {
  if (!(await readAdminSession())) return new Response("Please sign in again.", { status: 401 });
  const app = await getApplication((await ctx.params).id);
  const base = getForm(app?.form);
  const form = base && app?.source === "public" ? withContact(base) : base;
  if (!app || !form) return new Response("Not found", { status: 404 });
  return formPdfResponse(form, app.answers, { reference: app.reference, completedBy: app.source, submittedBy: app.brokerName });
}
