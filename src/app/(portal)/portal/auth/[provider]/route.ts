import { generateCodeVerifier, generateState } from "arctic";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { portalPath, requestOrigin } from "@/lib/portal/config";
import { isSsoProvider, ssoClient } from "@/lib/portal/sso";

// Starts single sign-on: redirects the broker to Microsoft or Google.
export async function GET(request: Request, { params }: RouteContext<"/portal/auth/[provider]">) {
  const { provider } = await params;
  const origin = requestOrigin(request);
  const login = new URL(portalPath("/login"), origin);

  if (!isSsoProvider(provider)) return NextResponse.redirect(login);
  const client = ssoClient(provider, new URL(portalPath(`/auth/${provider}/callback`), origin).toString());
  if (!client) {
    login.searchParams.set("error", "sso_unavailable");
    return NextResponse.redirect(login);
  }

  const state = generateState();
  const verifier = generateCodeVerifier();
  const url = client.createAuthorizationURL(state, verifier, ["openid", "profile", "email"]);

  const jar = await cookies();
  const opts = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/", maxAge: 600 };
  jar.set("otta_sso_state", state, opts);
  jar.set("otta_sso_verifier", verifier, opts);
  return NextResponse.redirect(url);
}
