import { NextResponse, type NextRequest } from "next/server";
import { PORTAL_HOST, isPublicPortalPath } from "@/lib/portal/config";
import { SESSION_COOKIE } from "@/lib/portal/session-cookie";

// Serves the broker portal on its own subdomain and keeps it off the website.
//   portal host:  /quotes  -> rewritten to /portal/quotes
//   website host: /portal/* -> redirected to the portal host
// It also does an optimistic sign-in check; every portal page still verifies
// the session itself (src/lib/portal/auth.ts).
export function proxy(request: NextRequest) {
  const url = request.nextUrl;
  const host = (request.headers.get("host") ?? "").split(":")[0].toLowerCase();
  const onPortalHost = PORTAL_HOST !== "" && host === PORTAL_HOST;

  if (PORTAL_HOST && !onPortalHost && url.pathname.startsWith("/portal")) {
    const target = new URL(url.pathname.replace(/^\/portal/, "") || "/", `https://${PORTAL_HOST}`);
    target.search = url.search;
    return NextResponse.redirect(target);
  }

  // Redirects on the portal host must use the address the browser used.
  const proto = request.headers.get("x-forwarded-proto") ?? url.protocol.replace(":", "");
  const portalOrigin = `${proto}://${request.headers.get("host") ?? url.host}`;

  let internalPath = url.pathname;
  if (onPortalHost) {
    if (url.pathname.startsWith("/portal")) {
      // Canonical portal URLs have no /portal prefix.
      const clean = new URL(url.pathname.replace(/^\/portal/, "") || "/", portalOrigin);
      clean.search = url.search;
      return NextResponse.redirect(clean);
    }
    if (url.pathname.startsWith("/api/")) {
      return new NextResponse(null, { status: 404 });
    }
    internalPath = url.pathname === "/" ? "/portal" : `/portal${url.pathname}`;
  }

  if (!internalPath.startsWith("/portal")) return NextResponse.next();

  if (!isPublicPortalPath(internalPath) && !request.cookies.has(SESSION_COOKIE)) {
    return NextResponse.redirect(new URL(onPortalHost ? "/login" : "/portal/login", onPortalHost ? portalOrigin : url.origin));
  }

  if (onPortalHost) {
    const rewritten = url.clone();
    rewritten.pathname = internalPath;
    return NextResponse.rewrite(rewritten);
  }
  return NextResponse.next();
}

export const config = {
  // Skip Next.js internals and static files.
  matcher: ["/((?!_next/|favicon.ico|icon.png|apple-icon.png|brand/|media/|team/).*)"],
};
