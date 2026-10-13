import { NextResponse } from "next/server";
import { finishSso } from "@/lib/auth/sso-flow";
import { STAFF_DOMAIN, adminPath } from "@/lib/admin/config";
import { findStaffByEmail } from "@/lib/admin/data";
import { writeAdminSession } from "@/lib/admin/session";
import { requestOrigin } from "@/lib/portal/config";

// Completes single sign-on for Otta staff. Only ottainsurance.co.nz accounts
// are accepted; Microsoft accounts must also come from Otta's own tenant.
export async function GET(request: Request, { params }: RouteContext<"/admin/auth/[provider]/callback">) {
  const { provider } = await params;
  const origin = requestOrigin(request);
  const url = (path: string) => new URL(adminPath(path), origin);
  const result = await finishSso(provider, request, { app: "ADMIN", url });
  if ("error" in result) return result.error;
  const { claims, email, domain } = result;
  const fail = () => NextResponse.redirect(new URL(`${url("/login")}?error=sso_not_registered`));

  if (domain !== STAFF_DOMAIN) return fail();
  const tenant = process.env.ADMIN_MICROSOFT_TENANT_ID;
  if (result.provider === "microsoft" && (!tenant || tenant === "organizations" || claims.tid !== tenant)) return fail();

  const member = await findStaffByEmail(email);
  await writeAdminSession({
    userId: member?.id ?? `sso:${email}`,
    name: member?.name ?? claims.name ?? email,
    email,
    role: member?.role ?? "Staff",
    method: result.provider,
  });
  return NextResponse.redirect(url("/"));
}
