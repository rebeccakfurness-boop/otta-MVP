import { NextResponse } from "next/server";
import { findBrokerage } from "@/lib/portal/data";
import { findUserById } from "@/lib/portal/accounts";
import { portalPath, requestOrigin } from "@/lib/portal/config";
import { writeSession } from "@/lib/portal/session";
import { redeemSignInLink } from "@/lib/portal/sign-in-links";

// Opens an emailed sign-in link: signs the broker in and takes them to Your
// account, where they can set a new password.
export async function GET(request: Request) {
  const origin = requestOrigin(request);
  const token = new URL(request.url).searchParams.get("token") ?? "";
  const link = await redeemSignInLink(token, "magic");
  const user = link && (await findUserById(link.userId));
  const brokerage = user && (await findBrokerage(user.brokerageId));
  if (!link || !user || !brokerage) {
    return NextResponse.redirect(`${origin}${portalPath("/login")}?error=link_expired`);
  }
  await writeSession({ userId: user.id, name: user.name, email: user.email, brokerageId: user.brokerageId, method: "link" });
  return NextResponse.redirect(`${origin}${portalPath("/account")}?signedInWithLink=1`);
}
