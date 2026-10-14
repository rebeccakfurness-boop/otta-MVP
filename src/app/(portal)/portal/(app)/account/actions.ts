"use server";

import type { PasswordState } from "@/components/auth/PasswordForm";
import { readSession } from "@/lib/portal/session";
import { passwordProblem, saveNewPassword } from "@/lib/portal/password";

export async function changePassword(_prev: PasswordState, formData: FormData): Promise<PasswordState> {
  const session = await readSession();
  if (!session) return { error: "Your session has ended. Please sign in again." };
  const password = String(formData.get("password") ?? "");
  const problem = passwordProblem(password, String(formData.get("confirm") ?? ""));
  if (problem) return { error: problem };
  await saveNewPassword(session.userId, password);
  return { ok: true };
}
