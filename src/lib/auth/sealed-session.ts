import "server-only";
import { sealData, unsealData } from "iron-session";
import { cookies } from "next/headers";
import { connection } from "next/server";

const TTL_SECONDS = 8 * 60 * 60; // a working day

/** True while the portals run on fictional demo data (see docs/broker-portal.md). */
export const demoMode = process.env.PORTAL_DEMO_LOGIN !== "false";

/**
 * Encrypted-cookie session store shared by the broker portal and the admin
 * portal. Each app uses its own cookie name and `kind`, so a session from one
 * can never be used in the other.
 *
 * Without SESSION_SECRET, a fixed fallback (in the source code) is used in local
 * development and demo mode only. It must never protect real data: set
 * SESSION_SECRET and PORTAL_DEMO_LOGIN=false before loading real data.
 */
export function createSessionStore<T extends { userId: string }>(options: { cookie: string; kind: string; fallbackSecret: string }) {
  function secret(): string | null {
    const s = process.env.SESSION_SECRET;
    if (s && s.length >= 32) return s;
    if (process.env.NODE_ENV !== "production" || demoMode) return options.fallbackSecret;
    return null;
  }

  async function read(): Promise<T | null> {
    // Sessions are checked against the current time, so this is request-time only.
    await connection();
    const key = secret();
    const sealed = (await cookies()).get(options.cookie)?.value;
    if (!key || !sealed) return null;
    try {
      const data = await unsealData<T & { kind?: string }>(sealed, { password: key, ttl: TTL_SECONDS });
      return data.kind === options.kind && data.userId ? (data as T) : null;
    } catch {
      return null;
    }
  }

  async function write(session: T) {
    const key = secret();
    if (!key) throw new Error("SESSION_SECRET is not configured");
    const sealed = await sealData({ ...session, kind: options.kind }, { password: key, ttl: TTL_SECONDS });
    (await cookies()).set(options.cookie, sealed, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: TTL_SECONDS,
    });
  }

  async function clear() {
    (await cookies()).delete(options.cookie);
  }

  return { secret, read, write, clear };
}
