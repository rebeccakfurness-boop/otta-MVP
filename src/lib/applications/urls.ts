import "server-only";
import { headers } from "next/headers";
import { site } from "@/content/site";
import { ADMIN_HOST, adminPath } from "@/lib/admin/config";
import { PORTAL_HOST, portalPath } from "@/lib/portal/config";

async function origin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

/** Full URL of a broker portal page, for emails. */
export async function portalUrl(path: string) {
  return PORTAL_HOST ? `https://${PORTAL_HOST}${path}` : `${await origin()}${portalPath(path)}`;
}

/** Full URL of an admin portal page, for emails. */
export async function adminUrl(path: string) {
  return ADMIN_HOST ? `https://${ADMIN_HOST}${path}` : `${await origin()}${adminPath(path)}`;
}

/** Full URL of a public website page (client links live on the website). */
export async function websiteUrl(path: string) {
  return PORTAL_HOST ? `${site.url}${path}` : `${await origin()}${path}`;
}
