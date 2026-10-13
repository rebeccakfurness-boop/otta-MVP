import "server-only";
import { redirect } from "next/navigation";
import { portalPath } from "./config";
import { findBrokerage } from "./data";
import { readSession } from "./session";

/** The signed-in broker, or a redirect to the login page. */
export async function requireBroker() {
  const session = await readSession();
  if (!session) redirect(portalPath("/login"));
  const brokerage = await findBrokerage(session.brokerageId);
  if (!brokerage) redirect(portalPath("/login"));
  return { ...session, brokerageName: brokerage.name };
}
