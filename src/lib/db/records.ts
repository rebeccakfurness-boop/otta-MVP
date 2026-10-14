import "server-only";
import { neon } from "@neondatabase/serverless";

// A small document store for records created in the app (new brokers and
// brokerages, access requests, used sign-in links). Neon Postgres when
// DATABASE_URL is set (the table is created on first use); otherwise memory,
// which resets when the server restarts (fine for the demo).

type Row<T> = { id: string; data: T; createdAt: string };

const memory = ((globalThis as { __ottaRecords?: Map<string, Map<string, Row<unknown>>> }).__ottaRecords ??= new Map());
/** The Neon connection string. The Vercel Neon integration names it after its prefix, so accept the usual ones. */
export const databaseUrl = process.env.DATABASE_URL || process.env.STORAGE_URL || process.env.POSTGRES_URL || "";
const useDb = !!databaseUrl;
let ready: Promise<unknown> | null = null;

function db() {
  const sql = neon(databaseUrl);
  ready ??= sql`create table if not exists records (
    collection text not null,
    id text not null,
    created_at timestamptz not null default now(),
    data jsonb not null,
    primary key (collection, id)
  )`;
  return { sql, ready };
}

export async function putRecord<T>(collection: string, id: string, data: T) {
  if (!useDb) {
    const c = memory.get(collection) ?? new Map();
    c.set(id, { id, data, createdAt: c.get(id)?.createdAt ?? new Date().toISOString() });
    memory.set(collection, c);
    return;
  }
  const { sql, ready } = db();
  await ready;
  await sql`insert into records (collection, id, data) values (${collection}, ${id}, ${JSON.stringify(data)})
    on conflict (collection, id) do update set data = excluded.data`;
}

export async function getRecord<T>(collection: string, id: string): Promise<T | null> {
  if (!useDb) return ((memory.get(collection)?.get(id)?.data as T | undefined) ?? null);
  const { sql, ready } = db();
  await ready;
  const rows = await sql`select data from records where collection = ${collection} and id = ${id}`;
  return (rows[0]?.data as T | undefined) ?? null;
}

/** Newest first. */
export async function listRecords<T>(collection: string): Promise<T[]> {
  if (!useDb) {
    return [...(memory.get(collection)?.values() ?? [])].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map((r) => r.data as T);
  }
  const { sql, ready } = db();
  await ready;
  const rows = await sql`select data from records where collection = ${collection} order by created_at desc limit 1000`;
  return rows.map((r) => r.data as T);
}
