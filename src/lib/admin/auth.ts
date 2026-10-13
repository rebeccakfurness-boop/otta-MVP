import "server-only";
import { redirect } from "next/navigation";
import { adminPath } from "./config";
import { readAdminSession } from "./session";

/** The signed-in Otta staff member, or a redirect to the admin sign-in page. */
export async function requireAdmin() {
  const session = await readAdminSession();
  if (!session) redirect(adminPath("/login"));
  return session;
}
