import "server-only";
import { Google, MicrosoftEntraId } from "arctic";

export type SsoProvider = "microsoft" | "google";

export const ssoProviders: Record<SsoProvider, string> = {
  microsoft: "Microsoft",
  google: "Google",
};

/**
 * An OAuth client for the provider, or null when its environment variables are
 * not set. Redirect URI: <portal origin>/auth/<provider>/callback (or
 * /portal/auth/<provider>/callback without a portal subdomain).
 */
export function ssoClient(provider: SsoProvider, redirectUri: string, app: "PORTAL" | "ADMIN" = "PORTAL") {
  if (provider === "microsoft") {
    const id = process.env[`${app}_MICROSOFT_CLIENT_ID`];
    const secret = process.env[`${app}_MICROSOFT_CLIENT_SECRET`];
    if (!id || !secret) return null;
    // "organizations" lets brokers sign in from their own Microsoft 365 tenant;
    // each brokerage's tenant ID must still be trusted in its record.
    const tenant = process.env[`${app}_MICROSOFT_TENANT_ID`] || "organizations";
    return new MicrosoftEntraId(tenant, id, secret, redirectUri);
  }
  const id = process.env[`${app}_GOOGLE_CLIENT_ID`];
  const secret = process.env[`${app}_GOOGLE_CLIENT_SECRET`];
  if (!id || !secret) return null;
  return new Google(id, secret, redirectUri);
}

export function isSsoProvider(value: string): value is SsoProvider {
  return value === "microsoft" || value === "google";
}
