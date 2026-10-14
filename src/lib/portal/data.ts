import "server-only";
// Data access for the broker portal. Every read is filtered by the signed-in
// login's scope (src/lib/portal/scope.ts). Swap the demo arrays for Neon
// Postgres queries here.
import { allOrganisations, allUsers } from "./accounts";
import { claims, forms, policies, quotes } from "./demo-data";
import { canSee, type Scope } from "./scope";

export async function findUserByEmail(email: string) {
  return (await allUsers()).find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

/** Any organisation that signs in: a brokerage, network or coverholder. */
export async function findBrokerage(id: string) {
  return (await allOrganisations()).find((b) => b.id === id) ?? null;
}

export async function findBrokerageByDomain(domain: string) {
  return (await allOrganisations()).find((b) => b.domains.includes(domain.toLowerCase())) ?? null;
}

export async function listQuotes(scope: Scope) {
  return quotes.filter((q) => canSee(scope, q)).sort((a, b) => b.submitted.localeCompare(a.submitted));
}

export async function getQuote(scope: Scope, ref: string) {
  return quotes.find((q) => q.ref === ref && canSee(scope, q)) ?? null;
}

export async function listPolicies(scope: Scope) {
  return policies.filter((p) => canSee(scope, p)).sort((a, b) => a.end.localeCompare(b.end));
}

export async function getPolicy(scope: Scope, id: string) {
  return policies.find((p) => p.id === id && canSee(scope, p)) ?? null;
}

export async function listClaims(scope: Scope) {
  return claims.filter((c) => canSee(scope, c)).sort((a, b) => b.lodged.localeCompare(a.lodged));
}

export async function getClaim(scope: Scope, id: string) {
  return claims.find((c) => c.id === id && canSee(scope, c)) ?? null;
}

export async function listForms() {
  return forms;
}

/** Brokerage names, for lists that span more than one brokerage. */
export async function organisationNames() {
  return Object.fromEntries((await allOrganisations()).map((b) => [b.id, b.name]));
}
