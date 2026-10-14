import "server-only";
// Data access for the admin portal. Unlike src/lib/portal/data.ts these reads
// span every brokerage, so only call them after requireAdmin(). Both portals
// read the same store (demo data now; Neon Postgres fed by manual entry and
// InsuredHQ later), so they always agree.
import { allBrokerages, allUsers } from "@/lib/portal/accounts";
import { forms, policies, quotes, staff } from "@/lib/portal/demo-data";

export async function findStaffByEmail(email: string) {
  return staff.find((s) => s.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function listAllPolicies() {
  return [...policies].sort((a, b) => a.end.localeCompare(b.end));
}

export async function listAllQuotes() {
  return [...quotes].sort((a, b) => b.submitted.localeCompare(a.submitted));
}

export async function findPolicy(id: string) {
  return policies.find((p) => p.id === id) ?? null;
}

export async function findQuote(ref: string) {
  return quotes.find((q) => q.ref === ref) ?? null;
}

export async function listBrokerages() {
  const [brokerages, users] = await Promise.all([allBrokerages(), allUsers()]);
  return brokerages.map((b) => ({
    ...b,
    users: users.filter((u) => u.brokerageId === b.id),
    quoteCount: quotes.filter((q) => q.brokerageId === b.id).length,
    policies: policies.filter((p) => p.brokerageId === b.id),
  }));
}

export async function findBrokerageWithUsers(id: string) {
  const [brokerages, users] = await Promise.all([allBrokerages(), allUsers()]);
  const b = brokerages.find((x) => x.id === id);
  return b ? { ...b, users: users.filter((u) => u.brokerageId === id) } : null;
}

export async function brokerageNames() {
  return Object.fromEntries((await allBrokerages()).map((b) => [b.id, b.name]));
}

export async function listAllForms() {
  return forms;
}
