import "server-only";
import { addressDetails, suggestAddresses } from "./address";

// Shared handler for /address-search on the website and in the broker portal.
// GET ?q=12 rata st      -> { suggestions: [...] }
// GET ?id=<suggestion id> -> { address: {...} }  (post code for a choice)

const hits = new Map<string, number[]>();
const LIMIT = 60; // lookups per minute per visitor

function limited(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "local";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > LIMIT;
}

export async function handleAddressSearch(request: Request) {
  if (limited(request)) return Response.json({ suggestions: [] }, { status: 429 });
  const params = new URL(request.url).searchParams;
  const session = params.get("s")?.slice(0, 64) || undefined;
  try {
    const id = params.get("id");
    if (id) return Response.json({ address: await addressDetails(id.slice(0, 300), session) });
    const suggestions = await suggestAddresses(params.get("q") ?? "", session);
    return Response.json({ suggestions }, { headers: { "cache-control": "private, max-age=300" } });
  } catch (error) {
    console.warn("[address-search]", error instanceof Error ? error.message : error);
    // Typing still works without suggestions.
    return Response.json({ suggestions: [] });
  }
}
