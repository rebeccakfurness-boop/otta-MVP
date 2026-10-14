"use server";

import { refresh } from "next/cache";
import { z } from "zod";
import { products } from "@/content/products";
import { readAdminSession } from "@/lib/admin/session";
import { allOrganisations, createOrganisation, createUser, saveOrgSettings, setUserAccess } from "@/lib/portal/accounts";
import { findUserByEmail } from "@/lib/portal/data";
import { sendInvite } from "@/lib/portal/invite";

export type OrgActionState = { ok?: boolean; message?: string; error?: string };

async function staff() {
  const session = await readAdminSession();
  if (!session) throw new Error("Not signed in");
  return session;
}

const productSlugs = (formData: FormData) => formData.getAll("products").map(String).filter((s) => products.some((p) => p.slug === s));

/** What a brokerage user sees: their own clients only, or the whole brokerage. */
export async function saveAccess(_prev: OrgActionState, formData: FormData): Promise<OrgActionState> {
  await staff();
  const sees = formData.get("sees") === "own" ? "own" : "brokerage";
  await setUserAccess(String(formData.get("userId") ?? ""), sees);
  refresh();
  return { ok: true };
}

/** Puts a brokerage in a network, or takes it out. */
export async function saveNetwork(_prev: OrgActionState, formData: FormData): Promise<OrgActionState> {
  await staff();
  const id = String(formData.get("brokerageId") ?? "");
  const networkId = String(formData.get("networkId") ?? "");
  const orgs = await allOrganisations();
  if (networkId && !orgs.some((o) => o.id === networkId && o.kind === "network")) return { error: "Choose a network." };
  await saveOrgSettings({ id, networkId: networkId || null });
  refresh();
  return { ok: true };
}

export async function saveProducts(_prev: OrgActionState, formData: FormData): Promise<OrgActionState> {
  await staff();
  await saveOrgSettings({ id: String(formData.get("orgId") ?? ""), productSlugs: productSlugs(formData) });
  refresh();
  return { ok: true };
}

const orgSchema = z.object({ name: z.string().trim().min(2, "Enter a name").max(120), kind: z.enum(["network", "coverholder"]) });

export async function addOrganisation(_prev: OrgActionState, formData: FormData): Promise<OrgActionState> {
  await staff();
  const parsed = orgSchema.safeParse({ name: formData.get("name"), kind: formData.get("kind") });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const org = await createOrganisation(parsed.data.name, parsed.data.kind, productSlugs(formData));
  refresh();
  return { ok: true, message: `${org.name} added.` };
}

const personSchema = z.object({ name: z.string().trim().min(2, "Enter their name").max(120), email: z.email("Enter a valid email address") });

/** Adds a network or coverholder person and emails their welcome link. */
export async function addPerson(_prev: OrgActionState, formData: FormData): Promise<OrgActionState> {
  await staff();
  const parsed = personSchema.safeParse({ name: formData.get("name"), email: String(formData.get("email") ?? "").trim().toLowerCase() });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const org = (await allOrganisations()).find((o) => o.id === formData.get("orgId"));
  if (!org) return { error: "That organisation no longer exists." };
  if (await findUserByEmail(parsed.data.email)) return { error: "Someone already has a portal login with that email." };
  const user = await createUser({ name: parsed.data.name, email: parsed.data.email, brokerageId: org.id });
  const emailed = await sendInvite(user, org.name).catch(() => false);
  refresh();
  return {
    ok: true,
    message: emailed ? `Welcome email sent to ${user.email}.` : `${user.name} is set up. Email sending is off, so the welcome email was logged instead.`,
  };
}
