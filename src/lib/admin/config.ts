// Where the admin portal lives: its own subdomain, set with
// NEXT_PUBLIC_ADMIN_HOST (e.g. admin.ottainsurance.co.nz). Without it (local
// development, previews) it is reached at /admin on the same host.
export const ADMIN_HOST = process.env.NEXT_PUBLIC_ADMIN_HOST ?? "";

/** Build a link to an admin page, e.g. adminPath("/policies"). */
export function adminPath(path = "/") {
  if (ADMIN_HOST) return path;
  return path === "/" ? "/admin" : `/admin${path}`;
}

export function isPublicAdminPath(internalPath: string) {
  return internalPath === "/admin/login" || internalPath.startsWith("/admin/auth/");
}

export const ADMIN_SESSION_COOKIE = "otta_admin_session";

/** Email domain whose Google or Microsoft accounts may sign in as staff. */
export const STAFF_DOMAIN = "ottainsurance.co.nz";
