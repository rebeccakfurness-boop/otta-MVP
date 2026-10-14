import "server-only";
import bcrypt from "bcryptjs";
import { setPassword } from "./accounts";

/** Checks a new password and its confirmation. Returns an error message, or null if it's fine. */
export function passwordProblem(password: string, confirm: string) {
  if (password.length < 10) return "Use at least 10 characters.";
  if (password.length > 200) return "That password is too long.";
  if (password !== confirm) return "The two passwords don't match.";
  return null;
}

export async function saveNewPassword(userId: string, password: string) {
  await setPassword(userId, await bcrypt.hash(password, 12));
}
