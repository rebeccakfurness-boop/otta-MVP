import { attachmentResponse, getAttachment } from "@/lib/applications/attachments";
import { getApplication } from "@/lib/applications/store";
import { readBroker } from "@/lib/portal/auth";
import { canSeeApplication } from "@/lib/portal/scope";

// A supporting document sent with an application, for brokers who can see that application.
export async function GET(_request: Request, ctx: RouteContext<"/portal/applications/[id]/files/[file]">) {
  const broker = await readBroker();
  if (!broker) return new Response("Please sign in again.", { status: 401 });
  const { id, file } = await ctx.params;
  const app = await getApplication(id);
  if (!app || !canSeeApplication(broker.scope, app)) return new Response("Not found", { status: 404 });
  const found = await getAttachment(id, file);
  return found ? attachmentResponse(found) : new Response("Not found", { status: 404 });
}
