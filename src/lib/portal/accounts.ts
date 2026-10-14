import "server-only";
import { demoReady } from "@/lib/applications/store";
import { getRecord, listRecords, putRecord } from "@/lib/db/records";
import { brokerages as demoBrokerages, users as demoUsers } from "./demo-data";
import type { Brokerage, PortalUser } from "./types";

// Broker accounts: the demo brokerages and users, plus anyone added through the
// access request flow. Passwords set later (welcome or reset) are stored
// separately so they work for demo users too.

export type AccessRequest = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  brokerageName: string;
  fspNumber?: string;
  message?: string;
  /** A brokerage already on the portal whose email domain matches. */
  matchedBrokerageId?: string;
  status: "pending" | "approved" | "declined";
  createdAt: string;
  decidedAt?: string;
  decidedBy?: string;
  userId?: string;
};

/** Settings Otta changes in the admin portal (network membership, products), kept apart so they apply to demo records too. */
type OrgSettings = { id: string; networkId?: string | null; productSlugs?: string[] };

export async function allOrganisations(): Promise<Brokerage[]> {
  const settings = new Map((await listRecords<OrgSettings>("org-settings")).map((o) => [o.id, o]));
  return [...demoBrokerages, ...(await listRecords<Brokerage>("brokerages"))].map((b) => {
    const o = settings.get(b.id);
    if (!o) return b;
    return {
      ...b,
      ...(o.networkId !== undefined ? { networkId: o.networkId ?? undefined } : {}),
      ...(o.productSlugs ? { productSlugs: o.productSlugs } : {}),
    };
  });
}

/** Brokerages only (not networks or coverholders). */
export async function allBrokerages(): Promise<Brokerage[]> {
  return (await allOrganisations()).filter((b) => (b.kind ?? "brokerage") === "brokerage");
}

export async function saveOrgSettings(settings: OrgSettings) {
  const current = await getRecord<OrgSettings>("org-settings", settings.id);
  await putRecord("org-settings", settings.id, { ...current, ...settings });
}

export async function createOrganisation(name: string, kind: "network" | "coverholder", productSlugs: string[] = []) {
  const org: Brokerage = {
    id: `${kind === "network" ? "net" : "ch"}-${crypto.randomUUID().slice(0, 8)}`,
    name,
    kind,
    domains: [],
    microsoftTenantIds: [],
    ...(kind === "coverholder" ? { productSlugs } : {}),
  };
  await putRecord("brokerages", org.id, org);
  return org;
}

export async function allUsers(): Promise<PortalUser[]> {
  const added = await listRecords<PortalUser>("users");
  const passwords = new Map((await listRecords<{ userId: string; hash: string }>("passwords")).map((p) => [p.userId, p.hash]));
  const access = new Map((await listRecords<{ userId: string; sees: "own" | "brokerage" }>("user-access")).map((a) => [a.userId, a.sees]));
  return [...demoUsers, ...added].map((u) => ({
    ...u,
    ...(passwords.has(u.id) ? { passwordHash: passwords.get(u.id) } : {}),
    ...(access.has(u.id) ? { sees: access.get(u.id) } : {}),
  }));
}

/** What a brokerage user sees: only the business they placed, or the whole brokerage's. Set by Otta. */
export async function setUserAccess(userId: string, sees: "own" | "brokerage") {
  await putRecord("user-access", userId, { userId, sees });
}

export async function findUserById(id: string) {
  return (await allUsers()).find((u) => u.id === id) ?? null;
}

export async function setPassword(userId: string, hash: string) {
  await putRecord("passwords", userId, { userId, hash });
}

export async function createBrokerage(name: string, domains: string[]) {
  const brokerage: Brokerage = { id: `brk-${crypto.randomUUID().slice(0, 8)}`, name, domains, microsoftTenantIds: [] };
  await putRecord("brokerages", brokerage.id, brokerage);
  return brokerage;
}

export async function createUser(user: Omit<PortalUser, "id">) {
  const created: PortalUser = { ...user, id: `usr-${crypto.randomUUID().slice(0, 8)}` };
  await putRecord("users", created.id, created);
  return created;
}

export async function saveAccessRequest(request: AccessRequest) {
  await putRecord("access-requests", request.id, request);
}

export async function listAccessRequests() {
  // Demo mode: the sample requests are loaded with the sample applications.
  await demoReady();
  const requests = await listRecords<AccessRequest>("access-requests");
  return requests.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getAccessRequest(id: string) {
  return getRecord<AccessRequest>("access-requests", id);
}

/** Free email providers: never treat these as a brokerage's domain. */
export const FREE_EMAIL = /@(gmail|googlemail|outlook|hotmail|live|yahoo|icloud|me|xtra|protonmail)\./i;

export const emailDomain = (email: string) => email.split("@")[1]?.toLowerCase() ?? "";
