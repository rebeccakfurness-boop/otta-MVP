import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_HOST, ADMIN_SESSION_COOKIE, isPublicAdminPath } from "@/lib/admin/config";
import { PORTAL_HOST, isPublicPortalPath } from "@/lib/portal/config";
import { SESSION_COOKIE } from "@/lib/portal/session-cookie";

// Serves the broker portal and the admin portal on their own subdomains and
// keeps them off the website.
//   portal host:  /quotes  -> rewritten to /portal/quotes
//   admin host:   /brokers -> rewritten to /admin/brokers
//   website host: /portal/* and /admin/* -> redirected to their subdomains
// It also does an optimistic sign-in check; every page still verifies the
// session itself (src/lib/portal/auth.ts, src/lib/admin/auth.ts).
const apps = [
  { host: PORTAL_HOST, prefix: "/portal", cookie: SESSION_COOKIE, isPublic: isPublicPortalPath },
  { host: ADMIN_HOST, prefix: "/admin", cookie: ADMIN_SESSION_COOKIE, isPublic: isPublicAdminPath },
];

const under = (path: string, prefix: string) => path === prefix || path.startsWith(`${prefix}/`);

export function proxy(request: NextRequest) {
  const url = request.nextUrl;
  const host = (request.headers.get("host") ?? "").split(":")[0].toLowerCase();
  const hostApp = apps.find((a) => a.host !== "" && a.host === host);

  // Redirects on a subdomain must use the address the browser used.
  const proto = request.headers.get("x-forwarded-proto") ?? url.protocol.replace(":", "");
  const browserOrigin = `${proto}://${request.headers.get("host") ?? url.host}`;

  if (!hostApp) {
    // Website (or preview) host: send portal and admin paths to their subdomains.
    for (const app of apps) {
      if (app.host && under(url.pathname, app.prefix)) {
        const target = new URL(url.pathname.slice(app.prefix.length) || "/", `https://${app.host}`);
        target.search = url.search;
        return NextResponse.redirect(target);
      }
    }
    const pathApp = apps.find((a) => under(url.pathname, a.prefix));
    if (pathApp && !pathApp.isPublic(url.pathname) && !request.cookies.has(pathApp.cookie)) {
      return NextResponse.redirect(new URL(`${pathApp.prefix}/login`, url.origin));
    }
    return NextResponse.next();
  }

  // Subdomain host: everything maps into that app.
  if (under(url.pathname, hostApp.prefix)) {
    // Canonical URLs have no prefix.
    const clean = new URL(url.pathname.slice(hostApp.prefix.length) || "/", browserOrigin);
    clean.search = url.search;
    return NextResponse.redirect(clean);
  }
  if (url.pathname.startsWith("/api/") || apps.some((a) => under(url.pathname, a.prefix))) {
    return new NextResponse(null, { status: 404 });
  }

  const internalPath = url.pathname === "/" ? hostApp.prefix : `${hostApp.prefix}${url.pathname}`;
  if (!hostApp.isPublic(internalPath) && !request.cookies.has(hostApp.cookie)) {
    return NextResponse.redirect(new URL("/login", browserOrigin));
  }
  const rewritten = url.clone();
  rewritten.pathname = internalPath;
  return NextResponse.rewrite(rewritten);
}

export const config = {
  // Skip Next.js internals and static files.
  matcher: ["/((?!_next/|favicon.ico|icon.png|apple-icon.png|brand/|media/|team/|images/|downloads/|documents/).*)"],
};
