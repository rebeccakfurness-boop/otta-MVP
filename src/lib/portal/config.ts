// Where the broker portal lives.
//
// In production the portal is served on its own subdomain, set with
// NEXT_PUBLIC_PORTAL_HOST (e.g. portal.ottainsurance.co.nz). src/proxy.ts maps
// that host onto the /portal routes, so portal URLs are clean (/quotes).
// Without it (local development, Vercel previews) the portal is reached at
// /portal on the same host.
export const PORTAL_HOST = process.env.NEXT_PUBLIC_PORTAL_HOST ?? "";

/** Build a link to a portal page, e.g. portalPath("/quotes"). */
export function portalPath(path = "/") {
  if (PORTAL_HOST) return path;
  return path === "/" ? "/portal" : `/portal${path}`;
}

/** Full link to a portal page from the website (the portal may be on its own subdomain). */
export function portalUrl(path: string) {
  return PORTAL_HOST ? `https://${PORTAL_HOST}${path}` : portalPath(path);
}

/** The website's "Account Login" button points here. */
export const portalLoginUrl = PORTAL_HOST ? `https://${PORTAL_HOST}/login` : "/portal/login";

/** Portal pages that don't need a signed-in user. */
export function isPublicPortalPath(internalPath: string) {
  return (
    internalPath === "/portal/login" ||
    internalPath.startsWith("/portal/login/") ||
    internalPath.startsWith("/portal/auth/") ||
    internalPath === "/portal/join" ||
    internalPath === "/portal/welcome"
  );
}

/** The origin the browser used (honours proxies and the portal subdomain). */
export function requestOrigin(request: Request) {
  const url = new URL(request.url);
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? url.host;
  const proto = request.headers.get("x-forwarded-proto") ?? url.protocol.replace(":", "");
  return `${proto}://${host}`;
}
