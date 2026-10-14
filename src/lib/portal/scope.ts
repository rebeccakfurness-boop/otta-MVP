import { getForm } from "@/content/forms";
import type { Brokerage, PortalUser } from "./types";

/**
 * What a portal login can see, worked out from their organisation and the
 * level Otta set for them. Brokers never see the level itself: the portal
 * simply shows them the right records.
 *
 *   own          an individual broker: only the business they placed
 *   brokerage    a broker company: everything placed by its brokers
 *   network      a broker network: everything placed by its member brokerages
 *   coverholder  a capacity provider: everything on the products it writes
 */
export type Scope = {
  level: "own" | "brokerage" | "network" | "coverholder";
  userId: string;
  email: string;
  /** The brokerages whose business is visible; null means any. */
  brokerageIds: string[] | null;
  /** The products visible; null means any. */
  productSlugs: string[] | null;
  /** Their own brokerage, for placing business. Networks and coverholders don't place business. */
  ownBrokerageId: string | null;
  /** Records from more than one brokerage are visible, so lists name the brokerage. */
  spansBrokerages: boolean;
};

export function scopeFor(user: Pick<PortalUser, "id" | "email" | "sees">, org: Brokerage, all: Brokerage[]): Scope {
  const base = { userId: user.id, email: user.email };
  const kind = org.kind ?? "brokerage";
  if (kind === "network") {
    const members = all.filter((b) => b.networkId === org.id).map((b) => b.id);
    return { ...base, level: "network", brokerageIds: members, productSlugs: null, ownBrokerageId: null, spansBrokerages: true };
  }
  if (kind === "coverholder") {
    return { ...base, level: "coverholder", brokerageIds: null, productSlugs: org.productSlugs ?? [], ownBrokerageId: null, spansBrokerages: true };
  }
  return { ...base, level: user.sees ?? "brokerage", brokerageIds: [org.id], productSlugs: null, ownBrokerageId: org.id, spansBrokerages: false };
}

/** Whether a quote, policy or claim is visible. */
export function canSee(scope: Scope, r: { brokerageId: string; productSlug: string; brokerUserId?: string }) {
  if (scope.brokerageIds && !scope.brokerageIds.includes(r.brokerageId)) return false;
  if (scope.productSlugs && !scope.productSlugs.includes(r.productSlug)) return false;
  if (scope.level === "own" && r.brokerUserId !== scope.userId) return false;
  return true;
}

/** Whether an online application or client link is visible. */
export function canSeeApplication(scope: Scope, a: { brokerageId: string; form?: string; brokerEmail: string }) {
  if (scope.brokerageIds && !scope.brokerageIds.includes(a.brokerageId)) return false;
  if (scope.productSlugs && !getForm(a.form)?.productSlugs.some((p) => scope.productSlugs!.includes(p))) return false;
  if (scope.level === "own" && a.brokerEmail.toLowerCase() !== scope.email.toLowerCase()) return false;
  return true;
}

/** Placing business (forms, client links, binding) is for brokers, on their own brokerage's records. */
export function canPlace(scope: Scope, brokerageId?: string) {
  return !!scope.ownBrokerageId && (brokerageId === undefined || brokerageId === scope.ownBrokerageId);
}

/** Menu items only brokers use. Hidden for networks and coverholders. */
export const brokerOnlyPaths = ["/applications", "/forms", "/training"];

/** A whole brokerage's view, for the admin portal's broker pages. */
export function brokerageScope(brokerageId: string): Scope {
  return { level: "brokerage", userId: "", email: "", brokerageIds: [brokerageId], productSlugs: null, ownBrokerageId: brokerageId, spansBrokerages: false };
}
