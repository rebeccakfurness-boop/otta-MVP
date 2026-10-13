import { NextResponse } from "next/server";
import { finishSso } from "@/lib/auth/sso-flow";
import { portalPath, requestOrigin } from "@/lib/portal/config";
import { findBrokerage, findBrokerageByDomain, findUserByEmail } from "@/lib/portal/data";
import { writeSession } from "@/lib/portal/session";

// Completes single sign-on and starts a broker session.
export async function GET(request: Request, { params }: RouteContext<"/portal/auth/[provider]/callback">) {
  const { provider } = await params;
  const origin = requestOrigin(request);
  const url = (path: string) => new URL(portalPath(path), origin);
  const result = await finishSso(provider, request, { app: "PORTAL", url });
  if ("error" in result) return result.error;
  const { claims, email, domain } = result;
  const fail = () => NextResponse.redirect(new URL(`${url("/login")}?error=sso_not_registered`));

  const user = await findUserByEmail(email);
  const brokerage = user ? await findBrokerage(user.brokerageId) : await findBrokerageByDomain(domain);
  if (!brokerage) return fail();
  // Microsoft: the account's tenant must be trusted for this brokerage.
  if (result.provider === "microsoft" && (!claims.tid || !brokerage.microsoftTenantIds.includes(claims.tid))) return fail();

  await writeSession({
    userId: user?.id ?? `sso:${email}`,
    name: user?.name ?? claims.name ?? email,
    email,
    brokerageId: brokerage.id,
    method: result.provider,
  });
  return NextResponse.redirect(url("/"));
}
