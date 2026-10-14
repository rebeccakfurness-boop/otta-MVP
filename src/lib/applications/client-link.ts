import "server-only";
import { sealData, unsealData } from "iron-session";
import { connection } from "next/server";
import { sessionSecret } from "@/lib/portal/session";

// A client link carries everything needed to accept the client's answers in a
// sealed (encrypted and signed) token, so it works without a database lookup
// and can't be altered to point at another brokerage.

export const LINK_DAYS = 30;

export type LinkToken = {
  kind: "client-link";
  id: string;
  /** The online form the link opens (see src/content/forms). */
  form: string;
  brokerageId: string;
  brokerageName: string;
  brokerName: string;
  brokerEmail: string;
  clientName: string;
  clientEmail?: string;
};

export async function sealLink(data: Omit<LinkToken, "kind">) {
  const password = sessionSecret();
  if (!password) throw new Error("SESSION_SECRET is not set");
  return sealData({ ...data, kind: "client-link" }, { password, ttl: LINK_DAYS * 24 * 60 * 60 });
}

export async function openLink(token: string): Promise<LinkToken | null> {
  // Expiry is checked against the current time, so this is request-time only.
  await connection();
  const password = sessionSecret();
  if (!password || !token || token.length > 4000) return null;
  try {
    const data = await unsealData<LinkToken>(decodeURIComponent(token), { password, ttl: LINK_DAYS * 24 * 60 * 60 });
    return data.kind === "client-link" && data.id && data.brokerageId ? data : null;
  } catch {
    return null;
  }
}
