"use server";

import type { PasswordState } from "@/components/auth/PasswordForm";
import { onboarding } from "@/content/onboarding";
import { findUserById } from "@/lib/portal/accounts";
import { passwordProblem, saveNewPassword } from "@/lib/portal/password";
import { writeSession } from "@/lib/portal/session";
import { readSignInLink, redeemSignInLink } from "@/lib/portal/sign-in-links";

/** Sets the new broker's password from their welcome link, then signs them in. */
export async function completeWelcome(_prev: PasswordState, formData: FormData): Promise<PasswordState> {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const problem = passwordProblem(password, String(formData.get("confirm") ?? ""));
  // Check the link first so a typo doesn't use it up.
  if (!(await readSignInLink(token, "invite"))) return { error: onboarding.welcome.expired };
  if (problem) return { error: problem };
  const link = await redeemSignInLink(token, "invite");
  const user = link && (await findUserById(link.userId));
  if (!user) return { error: onboarding.welcome.expired };
  await saveNewPassword(user.id, password);
  await writeSession({ userId: user.id, name: user.name, email: user.email, brokerageId: user.brokerageId, method: "password" });
  return { ok: true };
}
