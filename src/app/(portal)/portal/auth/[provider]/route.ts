import { startSso } from "@/lib/auth/sso-flow";
import { portalPath, requestOrigin } from "@/lib/portal/config";

// Starts single sign-on for brokers.
export async function GET(request: Request, { params }: RouteContext<"/portal/auth/[provider]">) {
  const { provider } = await params;
  const origin = requestOrigin(request);
  return startSso(provider, { app: "PORTAL", url: (path) => new URL(portalPath(path), origin) });
}
