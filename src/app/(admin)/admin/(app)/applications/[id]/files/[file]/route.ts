import { readAdminSession } from "@/lib/admin/session";
import { attachmentResponse, getAttachment } from "@/lib/applications/attachments";

// A supporting document sent with an application (Otta staff only).
export async function GET(_request: Request, ctx: RouteContext<"/admin/applications/[id]/files/[file]">) {
  if (!(await readAdminSession())) return new Response("Please sign in again.", { status: 401 });
  const { id, file } = await ctx.params;
  const found = await getAttachment(id, file);
  return found ? attachmentResponse(found) : new Response("Not found", { status: 404 });
}
