import "server-only";
import { decodeIdToken, generateCodeVerifier, generateState } from "arctic";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { isSsoProvider, ssoClient } from "@/lib/portal/sso";

export type SsoClaims = {
  email?: string;
  preferred_username?: string;
  name?: string;
  email_verified?: boolean;
  hd?: string; // Google Workspace domain
  tid?: string; // Microsoft tenant
};

type FlowOptions = {
  app: "PORTAL" | "ADMIN";
  /** Absolute URL for an app path, using the browser's origin. */
  url: (path: string) => URL;
};

const cookieOpts = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/", maxAge: 600 };

/** Step 1: redirect to Microsoft or Google. */
export async function startSso(provider: string, opts: FlowOptions) {
  const login = opts.url("/login");
  if (!isSsoProvider(provider)) return NextResponse.redirect(login);
  const client = ssoClient(provider, opts.url(`/auth/${provider}/callback`).toString(), opts.app);
  if (!client) {
    login.searchParams.set("error", "sso_unavailable");
    return NextResponse.redirect(login);
  }
  const state = generateState();
  const verifier = generateCodeVerifier();
  const jar = await cookies();
  jar.set(`otta_${opts.app.toLowerCase()}_sso_state`, state, cookieOpts);
  jar.set(`otta_${opts.app.toLowerCase()}_sso_verifier`, verifier, cookieOpts);
  return NextResponse.redirect(client.createAuthorizationURL(state, verifier, ["openid", "profile", "email"]));
}

/**
 * Step 2: validate the callback and return the identity's claims, or a redirect
 * back to the login page with an error.
 */
export async function finishSso(
  provider: string,
  request: Request,
  opts: FlowOptions,
): Promise<{ claims: SsoClaims; provider: "microsoft" | "google"; email: string; domain: string } | { error: NextResponse }> {
  const fail = (error: string) => {
    const login = opts.url("/login");
    login.searchParams.set("error", error);
    return { error: NextResponse.redirect(login) };
  };
  const reqUrl = new URL(request.url);
  const jar = await cookies();
  const prefix = `otta_${opts.app.toLowerCase()}_sso`;
  const state = jar.get(`${prefix}_state`)?.value;
  const verifier = jar.get(`${prefix}_verifier`)?.value;
  jar.delete(`${prefix}_state`);
  jar.delete(`${prefix}_verifier`);

  const code = reqUrl.searchParams.get("code");
  if (!isSsoProvider(provider) || !code || !state || !verifier || reqUrl.searchParams.get("state") !== state) {
    return fail("sso_failed");
  }
  const client = ssoClient(provider, opts.url(`/auth/${provider}/callback`).toString(), opts.app);
  if (!client) return fail("sso_unavailable");

  let claims: SsoClaims;
  try {
    const tokens = await client.validateAuthorizationCode(code, verifier);
    claims = decodeIdToken(tokens.idToken()) as SsoClaims;
  } catch (error) {
    console.error("SSO code exchange failed", error);
    return fail("sso_failed");
  }
  const email = (claims.email ?? claims.preferred_username ?? "").toLowerCase();
  const domain = email.split("@")[1] ?? "";
  if (!email || !domain) return fail("sso_failed");
  // Only trust Google identities the provider vouches for.
  if (provider === "google" && (!claims.email_verified || claims.hd !== domain)) return fail("sso_not_registered");
  return { claims, provider, email, domain };
}
