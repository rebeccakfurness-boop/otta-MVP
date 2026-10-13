"use server";

import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { z } from "zod";
import type { SignInState } from "@/components/auth/SignInForm";
import { findStaffByEmail } from "@/lib/admin/data";
import { adminSessionSecret, clearAdminSession, writeAdminSession } from "@/lib/admin/session";

const schema = z.object({ email: z.email().max(200), password: z.string().min(1).max(200) });

// Best-effort per-instance throttle: 5 failed attempts per email and IP per 15 minutes.
const failures = new Map<string, number[]>();
const DUMMY_HASH = "$2b$12$PwcjONkhb9JEAqYsH/IF0uqtz0RdbncvjfiRNRjt05Hh.iFv3NkkC";

export async function adminLogin(_prev: SignInState, formData: FormData): Promise<SignInState> {
  const email = String(formData.get("email") ?? "");
  const parsed = schema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) return { error: "Enter your email address and password.", email };
  if (!adminSessionSecret()) return { error: "Sign in isn't available yet. Please try again later.", email };

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const key = `${parsed.data.email.toLowerCase()}|${ip}`;
  const recent = (failures.get(key) ?? []).filter((t) => Date.now() - t < 15 * 60_000);
  failures.set(key, recent);
  if (recent.length >= 5) return { error: "Too many attempts. Please wait 15 minutes and try again.", email };

  const user = await findStaffByEmail(parsed.data.email);
  const ok = await bcrypt.compare(parsed.data.password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !user.passwordHash || !ok) {
    recent.push(Date.now());
    return { error: "That email and password don't match our records.", email };
  }
  failures.delete(key);
  await writeAdminSession({ userId: user.id, name: user.name, email: user.email, role: user.role, method: "password" });
  return { ok: true };
}

export async function adminLogout() {
  await clearAdminSession();
}
