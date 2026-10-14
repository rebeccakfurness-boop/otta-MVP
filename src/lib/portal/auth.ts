import "server-only";
import { notFound, redirect } from "next/navigation";
import { allOrganisations, findUserById } from "./accounts";
import { portalPath } from "./config";
import { canPlace, scopeFor } from "./scope";
import { readSession } from "./session";

/**
 * The signed-in login and what they can see, or a redirect to the login page.
 * The level is read fresh on every request, so a change Otta makes in the
 * admin portal applies straight away.
 */
/** The signed-in login and their scope, or null. For server actions and routes. */
export async function readBroker() {
  const session = await readSession();
  if (!session) return null;
  const [user, orgs] = await Promise.all([findUserById(session.userId), allOrganisations()]);
  const org = orgs.find((b) => b.id === session.brokerageId);
  if (!org || !user) return null;
  return { ...session, brokerageName: org.name, scope: scopeFor(user, org, orgs) };
}

export async function requireBroker() {
  const session = await readSession();
  if (!session) redirect(portalPath("/login"));
  const [user, orgs] = await Promise.all([findUserById(session.userId), allOrganisations()]);
  const org = orgs.find((b) => b.id === session.brokerageId);
  if (!org || !user) redirect(portalPath("/login"));
  return { ...session, brokerageName: org.name, scope: scopeFor(user, org, orgs) };
}

/** A broker who places business (forms, client links). Networks and coverholders get a plain "not found". */
export async function requirePlacingBroker() {
  const broker = await requireBroker();
  if (!canPlace(broker.scope)) notFound();
  return broker;
}
