import "server-only";
import { neon } from "@neondatabase/serverless";
import { demoMode } from "@/lib/auth/sealed-session";
import { databaseUrl } from "@/lib/db/records";
import type { Answers } from "@/lib/forms/application";

// Online applications and the client links brokers send out.
//
// With DATABASE_URL (Neon, added by the Vercel Neon integration) records are
// kept in Postgres and the tables are created on first use. Without it they are
// held in memory: fine for the demo, but they reset when the server restarts.
// The client link itself never depends on storage (it is a sealed token), so a
// client can always complete the form and the email always goes out.

/** Who sent it: a broker, a broker's client from a link, or someone applying directly on the website. */
export type ApplicationSource = "broker" | "client" | "public";

/** Direct website applications have no brokerage. */
export const DIRECT_BROKERAGE = "direct";

export type Application = {
  id: string;
  /** Which online form (see src/content/forms). Missing on early records, which are building applications. */
  form?: string;
  reference: string;
  brokerageId: string;
  source: ApplicationSource;
  /** Who sent it: the broker, or the client who completed a link. */
  submittedBy: string;
  submittedByEmail: string;
  /** The broker the application belongs to. */
  brokerName: string;
  brokerEmail: string;
  insuredName: string;
  propertyAddress: string;
  linkId?: string;
  answers: Answers;
  createdAt: string;
};

export type ClientLink = {
  id: string;
  form?: string;
  brokerageId: string;
  brokerName: string;
  brokerEmail: string;
  clientName: string;
  clientEmail?: string;
  createdAt: string;
  expiresAt: string;
  completedAt?: string;
  applicationId?: string;
  /** The link itself, so the broker can copy it again. */
  url?: string;
};

export const storageMode = databaseUrl ? "database" : "memory";

/** In demo mode the portals start with sample applications (see demo-seed.ts). DEMO_DATA=off turns this off. */
export const demoDataOn = demoMode && process.env.DEMO_DATA !== "off";
export const demoReady = () => (demoDataOn ? import("./demo-seed").then((m) => m.ensureDemoData()) : Promise.resolve());

// --- In-memory fallback (kept on globalThis so dev reloads don't wipe it) ---
const memory = ((globalThis as { __ottaApplications?: { apps: Application[]; links: ClientLink[] } }).__ottaApplications ??= {
  apps: [],
  links: [],
});

// --- Neon ---
let ready: Promise<void> | null = null;
function db() {
  const sql = neon(databaseUrl);
  ready ??= (async () => {
    await sql`create table if not exists applications (
      id text primary key,
      brokerage_id text not null,
      created_at timestamptz not null default now(),
      data jsonb not null
    )`;
    await sql`create table if not exists client_links (
      id text primary key,
      brokerage_id text not null,
      created_at timestamptz not null default now(),
      data jsonb not null
    )`;
  })();
  return { sql, ready };
}

export async function saveApplication(app: Application) {
  if (storageMode === "memory") {
    memory.apps.unshift(app);
    return;
  }
  const { sql, ready } = db();
  await ready;
  await sql`insert into applications (id, brokerage_id, created_at, data)
    values (${app.id}, ${app.brokerageId}, ${app.createdAt}, ${JSON.stringify(app)})`;
}

export async function listApplications(brokerageId?: string): Promise<Application[]> {
  await demoReady();
  if (storageMode === "memory") return memory.apps.filter((a) => !brokerageId || a.brokerageId === brokerageId);
  const { sql, ready } = db();
  await ready;
  const rows = brokerageId
    ? await sql`select data from applications where brokerage_id = ${brokerageId} order by created_at desc limit 500`
    : await sql`select data from applications order by created_at desc limit 500`;
  return rows.map((r) => r.data as Application);
}

export async function getApplication(id: string, brokerageId?: string) {
  await demoReady();
  if (storageMode === "memory") return memory.apps.find((a) => a.id === id && (!brokerageId || a.brokerageId === brokerageId)) ?? null;
  const { sql, ready } = db();
  await ready;
  const rows = await sql`select data from applications where id = ${id}`;
  const app = (rows[0]?.data as Application | undefined) ?? null;
  return app && (!brokerageId || app.brokerageId === brokerageId) ? app : null;
}

export async function saveLink(link: ClientLink) {
  if (storageMode === "memory") {
    const i = memory.links.findIndex((l) => l.id === link.id);
    if (i >= 0) memory.links[i] = link;
    else memory.links.unshift(link);
    return;
  }
  const { sql, ready } = db();
  await ready;
  await sql`insert into client_links (id, brokerage_id, created_at, data)
    values (${link.id}, ${link.brokerageId}, ${link.createdAt}, ${JSON.stringify(link)})
    on conflict (id) do update set data = excluded.data`;
}

export async function listLinks(brokerageId: string): Promise<ClientLink[]> {
  await demoReady();
  if (storageMode === "memory") return memory.links.filter((l) => l.brokerageId === brokerageId);
  const { sql, ready } = db();
  await ready;
  const rows = await sql`select data from client_links where brokerage_id = ${brokerageId} order by created_at desc limit 200`;
  return rows.map((r) => r.data as ClientLink);
}

export async function getLink(id: string) {
  await demoReady();
  if (storageMode === "memory") return memory.links.find((l) => l.id === id) ?? null;
  const { sql, ready } = db();
  await ready;
  const rows = await sql`select data from client_links where id = ${id}`;
  return (rows[0]?.data as ClientLink | undefined) ?? null;
}

export function newId(prefix: string) {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`;
}

export function newReference(code = "BA") {
  const d = new Date();
  const stamp = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  return `OTT-${code}-${stamp}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`;
}
