import "server-only";
// Data access for the broker portal. Every read is scoped to the signed-in
// broker's brokerage. Swap the demo arrays for Neon Postgres queries here.
import { allBrokerages, allUsers } from "./accounts";
import { forms, policies, quotes } from "./demo-data";

export async function findUserByEmail(email: string) {
  return (await allUsers()).find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function findBrokerage(id: string) {
  return (await allBrokerages()).find((b) => b.id === id) ?? null;
}

export async function findBrokerageByDomain(domain: string) {
  return (await allBrokerages()).find((b) => b.domains.includes(domain.toLowerCase())) ?? null;
}

export async function listQuotes(brokerageId: string) {
  return quotes.filter((q) => q.brokerageId === brokerageId).sort((a, b) => b.submitted.localeCompare(a.submitted));
}

export async function getQuote(brokerageId: string, ref: string) {
  return quotes.find((q) => q.brokerageId === brokerageId && q.ref === ref) ?? null;
}

export async function listPolicies(brokerageId: string) {
  return policies.filter((p) => p.brokerageId === brokerageId).sort((a, b) => a.end.localeCompare(b.end));
}

export async function getPolicy(brokerageId: string, id: string) {
  return policies.find((p) => p.brokerageId === brokerageId && p.id === id) ?? null;
}

export async function listForms() {
  return forms;
}
