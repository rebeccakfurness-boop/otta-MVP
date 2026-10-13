"use server";

import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { z } from "zod";
import { findUserByEmail } from "@/lib/portal/data";
import { clearSession, sessionSecret, writeSession } from "@/lib/portal/session";

export type LoginState = { error?: string; email?: string; ok?: boolean };

const schema = z.object({
  email: z.email().max(200),
  password: z.string().min(1).max(200),
});

// Best-effort per-instance throttle: 5 failed attempts per email and IP per 15 minutes.
const failures = new Map<string, number[]>();
function tooManyAttempts(key: string) {
  const now = Date.now();
  const recent = (failures.get(key) ?? []).filter((t) => now - t < 15 * 60_000);
  failures.set(key, recent);
  return recent.length >= 5;
}

// A valid hash to compare against when the email is unknown, so response time
// doesn't reveal which emails have accounts.
const DUMMY_HASH = "$2b$12$kgw6YZ.3I6gyPzLWMBC.3.dB5rb1sN1UMjvrXtE.1eYFyA.vI.j4u";

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = schema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  const email = String(formData.get("email") ?? "");
  if (!parsed.success) return { error: "Enter your email address and password.", email };
  if (!sessionSecret()) return { error: "Sign in isn't available yet. Please try again later.", email };

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const key = `${parsed.data.email.toLowerCase()}|${ip}`;
  if (tooManyAttempts(key)) {
    return { error: "Too many attempts. Please wait 15 minutes and try again.", email };
  }

  const user = await findUserByEmail(parsed.data.email);
  const ok = await bcrypt.compare(parsed.data.password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !user.passwordHash || !ok) {
    failures.get(key)!.push(Date.now());
    return { error: "That email and password don't match our records.", email };
  }

  failures.delete(key);
  await writeSession({ userId: user.id, name: user.name, email: user.email, brokerageId: user.brokerageId, method: "password" });
  // The browser then does a full page load to the dashboard. A server-side
  // redirect here would skip the subdomain routing in src/proxy.ts.
  return { ok: true };
}

export async function logout() {
  await clearSession();
}
