import "server-only";
import { sealData, unsealData } from "iron-session";
import { connection } from "next/server";
import { getRecord, putRecord } from "@/lib/db/records";
import { sessionSecret } from "./session";

// Emailed sign-in links for the broker portal:
//   "magic"  a one-time sign-in link (forgotten password), valid 20 minutes
//   "invite" the welcome link for a newly approved broker, valid 7 days
// Links are sealed with SESSION_SECRET and can only be used once.

export type LinkPurpose = "magic" | "invite";
const TTL: Record<LinkPurpose, number> = { magic: 20 * 60, invite: 7 * 24 * 60 * 60 };

type Payload = { kind: "portal-link"; purpose: LinkPurpose; userId: string; jti: string; next?: string };

export async function createSignInLink(purpose: LinkPurpose, userId: string, next?: string) {
  const password = sessionSecret();
  if (!password) throw new Error("SESSION_SECRET is not set");
  const payload: Payload = { kind: "portal-link", purpose, userId, jti: crypto.randomUUID(), next };
  return sealData(payload, { password, ttl: TTL[purpose] });
}

/** Checks a link without using it up (e.g. to show the welcome page). */
export async function readSignInLink(token: string, purpose: LinkPurpose) {
  await connection();
  const password = sessionSecret();
  if (!password || !token || token.length > 2000) return null;
  try {
    const data = await unsealData<Payload>(token, { password, ttl: TTL[purpose] });
    if (data.kind !== "portal-link" || data.purpose !== purpose || !data.userId) return null;
    if (await getRecord("used-links", data.jti)) return null;
    return data;
  } catch {
    return null;
  }
}

/** Checks a link and marks it used, so it can't be used again. */
export async function redeemSignInLink(token: string, purpose: LinkPurpose) {
  const data = await readSignInLink(token, purpose);
  if (!data) return null;
  await putRecord("used-links", data.jti, { usedAt: new Date().toISOString() });
  return data;
}
