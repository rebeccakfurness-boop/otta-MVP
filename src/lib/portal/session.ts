import "server-only";
import { sealData, unsealData } from "iron-session";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { SESSION_COOKIE } from "./session-cookie";

export type PortalSession = {
  userId: string;
  name: string;
  email: string;
  brokerageId: string;
  method: "password" | "microsoft" | "google";
};

const TTL_SECONDS = 8 * 60 * 60; // a working day

/** True while the portal runs on fictional demo data (see docs/broker-portal.md). */
export const demoMode = process.env.PORTAL_DEMO_LOGIN !== "false";

/**
 * The session secret, or null when none is available.
 * Without SESSION_SECRET, a fixed fallback is used in local development and in
 * demo mode only. It is in the source code, so it must never protect real broker
 * data: set SESSION_SECRET and PORTAL_DEMO_LOGIN=false before loading real data.
 */
export function sessionSecret(): string | null {
  const secret = process.env.SESSION_SECRET;
  if (secret && secret.length >= 32) return secret;
  if (process.env.NODE_ENV !== "production" || demoMode) return "otta-portal-demo-only-secret-not-for-real-data-0000";
  return null;
}

export async function readSession(): Promise<PortalSession | null> {
  // Sessions are checked against the current time, so this is request-time only.
  await connection();
  const secret = sessionSecret();
  const sealed = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!secret || !sealed) return null;
  try {
    const data = await unsealData<Partial<PortalSession>>(sealed, { password: secret, ttl: TTL_SECONDS });
    return data.userId && data.brokerageId ? (data as PortalSession) : null;
  } catch {
    return null;
  }
}

export async function writeSession(session: PortalSession) {
  const secret = sessionSecret();
  if (!secret) throw new Error("SESSION_SECRET is not configured");
  const sealed = await sealData(session, { password: secret, ttl: TTL_SECONDS });
  (await cookies()).set(SESSION_COOKIE, sealed, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: TTL_SECONDS,
  });
}

export async function clearSession() {
  (await cookies()).delete(SESSION_COOKIE);
}
