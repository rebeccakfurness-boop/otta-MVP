import { startSso } from "@/lib/auth/sso-flow";
import { adminPath } from "@/lib/admin/config";
import { requestOrigin } from "@/lib/portal/config";

// Starts single sign-on for Otta staff.
export async function GET(request: Request, { params }: RouteContext<"/admin/auth/[provider]">) {
  const { provider } = await params;
  const origin = requestOrigin(request);
  return startSso(provider, { app: "ADMIN", url: (path) => new URL(adminPath(path), origin) });
}
