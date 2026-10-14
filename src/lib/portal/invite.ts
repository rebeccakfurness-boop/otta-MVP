import "server-only";
import { onboarding } from "@/content/onboarding";
import { site } from "@/content/site";
import { portalUrl, websiteUrl } from "@/lib/applications/urls";
import { sendEmail } from "@/lib/email";
import { createSignInLink } from "./sign-in-links";
import type { PortalUser } from "./types";

/** Emails a new portal login their 7 day welcome link, with the broker guide. */
export async function sendInvite(user: PortalUser, organisationName: string) {
  const token = await createSignInLink("invite", user.id);
  const url = await portalUrl(`/welcome?token=${encodeURIComponent(token)}`);
  const guideUrl = await websiteUrl(onboarding.guide.href);
  const message = onboarding.emails.invite({ name: user.name, brokerage: organisationName, url, guideUrl, helpEmail: site.email, phone: site.phone });
  return sendEmail({ to: user.email, senderName: "Otta Broker Portal", subject: message.subject, text: message.text });
}
