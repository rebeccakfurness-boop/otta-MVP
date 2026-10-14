// Temporary "Coming soon" gate in front of the whole site (website, portals,
// documents) until launch. Anyone without the preview cookie sees the branded
// Coming Soon screen, which has a small team sign-in.
//
//   SITE_PASSWORD   the shared password (falls back to the demo one below)
//   SITE_GATE=off   turns the gate off at launch

export const GATE_ON = process.env.SITE_GATE !== "off";
export const GATE_COOKIE = "otta_preview";
export const GATE_PATH = "/coming-soon";
const DEMO_PASSWORD = "OttaPreview2026";

export function gatePassword() {
  return process.env.SITE_PASSWORD || DEMO_PASSWORD;
}

/** The cookie value: a hash of the password, so changing the password signs everyone out. */
export async function gateToken(password = gatePassword()) {
  const data = new TextEncoder().encode(`otta-preview:${password}`);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Share the cookie across www, portal and admin on the real domain. */
export function cookieDomain(host: string) {
  const h = host.split(":")[0].toLowerCase();
  return h === "ottainsurance.co.nz" || h.endsWith(".ottainsurance.co.nz") ? ".ottainsurance.co.nz" : undefined;
}
