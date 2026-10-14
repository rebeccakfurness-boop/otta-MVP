import "server-only";
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

export async function allBrokerages(): Promise<Brokerage[]> {
  return [...demoBrokerages, ...(await listRecords<Brokerage>("brokerages"))];
}

export async function allUsers(): Promise<PortalUser[]> {
  const added = await listRecords<PortalUser>("users");
  const passwords = new Map((await listRecords<{ userId: string; hash: string }>("passwords")).map((p) => [p.userId, p.hash]));
  return [...demoUsers, ...added].map((u) => (passwords.has(u.id) ? { ...u, passwordHash: passwords.get(u.id) } : u));
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
  const requests = await listRecords<AccessRequest>("access-requests");
  return requests.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getAccessRequest(id: string) {
  return getRecord<AccessRequest>("access-requests", id);
}

/** Free email providers: never treat these as a brokerage's domain. */
export const FREE_EMAIL = /@(gmail|googlemail|outlook|hotmail|live|yahoo|icloud|me|xtra|protonmail)\./i;

export const emailDomain = (email: string) => email.split("@")[1]?.toLowerCase() ?? "";
