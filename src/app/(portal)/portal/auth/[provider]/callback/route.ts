import { decodeIdToken } from "arctic";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { portalPath, requestOrigin } from "@/lib/portal/config";
import { findBrokerage, findBrokerageByDomain, findUserByEmail } from "@/lib/portal/data";
import { sessionSecret, writeSession } from "@/lib/portal/session";
import { isSsoProvider, ssoClient } from "@/lib/portal/sso";

type Claims = {
  email?: string;
  preferred_username?: string;
  name?: string;
  email_verified?: boolean;
  hd?: string; // Google Workspace domain
  tid?: string; // Microsoft tenant
};

// Completes single sign-on and starts a portal session.
export async function GET(request: Request, { params }: RouteContext<"/portal/auth/[provider]/callback">) {
  const { provider } = await params;
  const url = new URL(request.url);
  const origin = requestOrigin(request);
  const fail = (error: string) => {
    const login = new URL(portalPath("/login"), origin);
    login.searchParams.set("error", error);
    return NextResponse.redirect(login);
  };

  const jar = await cookies();
  const state = jar.get("otta_sso_state")?.value;
  const verifier = jar.get("otta_sso_verifier")?.value;
  jar.delete("otta_sso_state");
  jar.delete("otta_sso_verifier");

  const code = url.searchParams.get("code");
  if (!isSsoProvider(provider) || !code || !state || !verifier || url.searchParams.get("state") !== state) {
    return fail("sso_failed");
  }
  const client = ssoClient(provider, new URL(portalPath(`/auth/${provider}/callback`), origin).toString());
  if (!client || !sessionSecret()) return fail("sso_unavailable");

  let claims: Claims;
  try {
    const tokens = await client.validateAuthorizationCode(code, verifier);
    claims = decodeIdToken(tokens.idToken()) as Claims;
  } catch (error) {
    console.error("SSO code exchange failed", error);
    return fail("sso_failed");
  }

  const email = (claims.email ?? claims.preferred_username ?? "").toLowerCase();
  const domain = email.split("@")[1] ?? "";
  if (!email || !domain) return fail("sso_failed");

  // Only trust identities the provider vouches for.
  if (provider === "google" && (!claims.email_verified || claims.hd !== domain)) return fail("sso_not_registered");

  const user = await findUserByEmail(email);
  const brokerage = user ? await findBrokerage(user.brokerageId) : await findBrokerageByDomain(domain);
  if (!brokerage) return fail("sso_not_registered");
  if (provider === "microsoft" && (!claims.tid || !brokerage.microsoftTenantIds.includes(claims.tid))) {
    return fail("sso_not_registered");
  }

  await writeSession({
    userId: user?.id ?? `sso:${email}`,
    name: user?.name ?? claims.name ?? email,
    email,
    brokerageId: brokerage.id,
    method: provider,
  });
  return NextResponse.redirect(new URL(portalPath("/"), origin));
}
