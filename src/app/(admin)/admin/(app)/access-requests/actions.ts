"use server";

import { z } from "zod";
import { onboarding } from "@/content/onboarding";
import { portalUrl } from "@/lib/applications/urls";
import { readAdminSession } from "@/lib/admin/session";
import { sendEmail } from "@/lib/email";
import {
  allBrokerages,
  createBrokerage,
  createUser,
  emailDomain,
  FREE_EMAIL,
  getAccessRequest,
  saveAccessRequest,
} from "@/lib/portal/accounts";
import { findUserByEmail } from "@/lib/portal/data";
import { createSignInLink } from "@/lib/portal/sign-in-links";
import type { PortalUser } from "@/lib/portal/types";

export type AccessActionState = { ok?: boolean; message?: string; error?: string };

async function staff() {
  const session = await readAdminSession();
  if (!session) throw new Error("Not signed in");
  return session;
}

/** Emails a broker their 7 day welcome link. */
async function sendInvite(user: PortalUser, brokerageName: string) {
  const token = await createSignInLink("invite", user.id);
  const url = await portalUrl(`/welcome?token=${encodeURIComponent(token)}`);
  const message = onboarding.emails.invite({ name: user.name, brokerage: brokerageName, url });
  return sendEmail({ to: user.email, senderName: "Otta Broker Portal", subject: message.subject, text: message.text });
}

/** An existing brokerage by id, or a new one ("new") named in the form. */
async function chooseBrokerage(formData: FormData, email: string, fallbackName: string) {
  const choice = String(formData.get("brokerage") ?? "");
  if (choice && choice !== "new") return (await allBrokerages()).find((b) => b.id === choice) ?? null;
  const name = String(formData.get("newBrokerageName") ?? "").trim() || fallbackName;
  if (name.length < 2) return null;
  return createBrokerage(name, FREE_EMAIL.test(email) ? [] : [emailDomain(email)]);
}

const sentNote = (emailed: boolean, email: string) =>
  emailed ? `Welcome email sent to ${email}.` : `Demo mode: email sending is off, so the welcome email to ${email} was logged instead of sent.`;

export async function approveRequest(_prev: AccessActionState, formData: FormData): Promise<AccessActionState> {
  const admin = await staff();
  const request = await getAccessRequest(String(formData.get("id") ?? ""));
  if (!request || request.status !== "pending") return { error: "This request has already been dealt with." };
  if (await findUserByEmail(request.email)) return { error: `${request.email} already has a portal account.` };
  const brokerage = await chooseBrokerage(formData, request.email, request.brokerageName);
  if (!brokerage) return { error: "Choose a brokerage, or enter a name for the new one." };
  const user = await createUser({ name: request.name, email: request.email, brokerageId: brokerage.id });
  await saveAccessRequest({ ...request, status: "approved", decidedAt: new Date().toISOString(), decidedBy: admin.name, userId: user.id, matchedBrokerageId: brokerage.id });
  const emailed = await sendInvite(user, brokerage.name).catch(() => false);
  return { ok: true, message: `${request.name} is set up at ${brokerage.name}. ${sentNote(emailed, request.email)}` };
}

export async function declineRequest(_prev: AccessActionState, formData: FormData): Promise<AccessActionState> {
  const admin = await staff();
  const request = await getAccessRequest(String(formData.get("id") ?? ""));
  if (!request || request.status !== "pending") return { error: "This request has already been dealt with." };
  await saveAccessRequest({ ...request, status: "declined", decidedAt: new Date().toISOString(), decidedBy: admin.name });
  const message = onboarding.emails.declined({ name: request.name });
  await sendEmail({ to: request.email, senderName: "Otta Broker Portal", subject: message.subject, text: message.text }).catch(() => false);
  return { ok: true, message: `Request from ${request.name} declined.` };
}

export async function resendInvite(_prev: AccessActionState, formData: FormData): Promise<AccessActionState> {
  await staff();
  const request = await getAccessRequest(String(formData.get("id") ?? ""));
  const user = request?.userId ? await findUserByEmail(request.email) : null;
  const brokerage = user && (await allBrokerages()).find((b) => b.id === user.brokerageId);
  if (!user || !brokerage) return { error: "We couldn't find that broker's account." };
  const emailed = await sendInvite(user, brokerage.name).catch(() => false);
  return { ok: true, message: sentNote(emailed, user.email) };
}

const inviteSchema = z.object({
  name: z.string().trim().min(2, "Enter the broker's name.").max(120),
  email: z.email("Enter the broker's email address.").max(200),
});

/** Otta staff add a broker directly, without a request. */
export async function inviteBroker(_prev: AccessActionState, formData: FormData): Promise<AccessActionState> {
  const admin = await staff();
  const parsed = inviteSchema.safeParse({ name: formData.get("name"), email: formData.get("email") });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const email = parsed.data.email.toLowerCase();
  if (await findUserByEmail(email)) return { error: `${email} already has a portal account.` };
  const brokerage = await chooseBrokerage(formData, email, "");
  if (!brokerage) return { error: "Choose a brokerage, or enter a name for the new one." };
  const user = await createUser({ name: parsed.data.name, email, brokerageId: brokerage.id });
  await saveAccessRequest({
    id: `req-${crypto.randomUUID().slice(0, 8)}`,
    name: user.name,
    email,
    phone: "",
    role: "Invited by Otta",
    brokerageName: brokerage.name,
    matchedBrokerageId: brokerage.id,
    status: "approved",
    createdAt: new Date().toISOString(),
    decidedAt: new Date().toISOString(),
    decidedBy: admin.name,
    userId: user.id,
  });
  const emailed = await sendInvite(user, brokerage.name).catch(() => false);
  return { ok: true, message: `${user.name} is set up at ${brokerage.name}. ${sentNote(emailed, email)}` };
}
