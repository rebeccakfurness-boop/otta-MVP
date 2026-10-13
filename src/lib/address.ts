import "server-only";

// New Zealand address suggestions for the online application form.
//
// Uses the first provider that is configured:
//   1. Addressfinder (NZ Post and LINZ data, the most complete for NZ):
//      ADDRESSFINDER_KEY and ADDRESSFINDER_SECRET
//   2. Google Places: GOOGLE_PLACES_API_KEY
//   3. Otherwise Photon (OpenStreetMap, free, no key), limited to New Zealand.
// Keys stay on the server; the browser only talks to /address-search.

export type AddressSuggestion = {
  id: string;
  /** The full address, as it should appear in the form. */
  label: string;
  postcode?: string;
};

export const addressProvider = process.env.ADDRESSFINDER_KEY
  ? "addressfinder"
  : process.env.GOOGLE_PLACES_API_KEY
    ? "google"
    : "photon";

const TIMEOUT = 4000;
const json = async (res: Response) => {
  if (!res.ok) throw new Error(`Address lookup responded ${res.status}`);
  return res.json();
};

export async function suggestAddresses(query: string, session?: string): Promise<AddressSuggestion[]> {
  const q = query.trim().slice(0, 120);
  if (q.length < 3) return [];
  const signal = AbortSignal.timeout(TIMEOUT);

  if (addressProvider === "addressfinder") {
    const url = new URL("https://api.addressfinder.io/api/nz/address/autocomplete/");
    url.search = new URLSearchParams({
      key: process.env.ADDRESSFINDER_KEY!,
      secret: process.env.ADDRESSFINDER_SECRET ?? "",
      q,
      format: "json",
      max: "6",
    }).toString();
    const data = (await json(await fetch(url, { signal }))) as { completions?: { a: string; pxid: string }[] };
    return (data.completions ?? []).map((c) => ({ id: `af:${c.pxid}`, label: c.a }));
  }

  if (addressProvider === "google") {
    const data = (await json(
      await fetch("https://places.googleapis.com/v1/places:autocomplete", {
        method: "POST",
        signal,
        headers: { "content-type": "application/json", "x-goog-api-key": process.env.GOOGLE_PLACES_API_KEY! },
        body: JSON.stringify({ input: q, includedRegionCodes: ["nz"], sessionToken: session }),
      }),
    )) as { suggestions?: { placePrediction?: { placeId: string; text: { text: string } } }[] };
    return (data.suggestions ?? [])
      .flatMap((s) => (s.placePrediction ? [s.placePrediction] : []))
      .slice(0, 6)
      .map((p) => ({ id: `g:${p.placeId}`, label: p.text.text.replace(/, New Zealand$/, "") }));
  }

  const url = new URL("https://photon.komoot.io/api/");
  // Bounding box around New Zealand.
  url.search = new URLSearchParams({ q, limit: "10", lang: "en", bbox: "165.8,-47.4,179,-34.1" }).toString();
  const data = (await json(await fetch(url, { signal, headers: { "user-agent": "Otta website (ottainsurance.co.nz)" } }))) as {
    features?: { properties: Record<string, string | undefined> }[];
  };
  return dedupe(
    (data.features ?? [])
      .map((f) => f.properties)
      .filter((p) => p.countrycode === "NZ" && (p.street || p.name))
      .map((p) => {
        const street = p.housenumber ? `${p.housenumber} ${p.street ?? p.name}` : (p.street ?? p.name);
        const suburb = p.district ?? p.locality;
        const city = p.city ?? p.county;
        const parts = [p.street && p.name && p.name !== p.street && !p.housenumber ? p.name : null, street, suburb !== city ? suburb : null, city];
        const label = [...new Set(parts.filter(Boolean))].join(", ") + (p.postcode ? ` ${p.postcode}` : "");
        return { id: `osm:${label}`, label, postcode: p.postcode };
      }),
  ).slice(0, 6);
}

/** Full details for a chosen suggestion, so the post code can be filled in. */
export async function addressDetails(id: string, session?: string): Promise<AddressSuggestion | null> {
  const signal = AbortSignal.timeout(TIMEOUT);
  if (id.startsWith("af:") && process.env.ADDRESSFINDER_KEY) {
    const url = new URL("https://api.addressfinder.io/api/nz/address/metadata/");
    url.search = new URLSearchParams({
      key: process.env.ADDRESSFINDER_KEY,
      secret: process.env.ADDRESSFINDER_SECRET ?? "",
      pxid: id.slice(3),
      format: "json",
    }).toString();
    const d = (await json(await fetch(url, { signal }))) as { a?: string; postcode?: string };
    return d.a ? { id, label: d.a, postcode: d.postcode } : null;
  }
  if (id.startsWith("g:") && process.env.GOOGLE_PLACES_API_KEY) {
    const url = new URL(`https://places.googleapis.com/v1/places/${encodeURIComponent(id.slice(2))}`);
    if (session) url.searchParams.set("sessionToken", session);
    const d = (await json(
      await fetch(url, {
        signal,
        headers: { "x-goog-api-key": process.env.GOOGLE_PLACES_API_KEY, "x-goog-fieldmask": "formattedAddress,addressComponents" },
      }),
    )) as { formattedAddress?: string; addressComponents?: { longText: string; types: string[] }[] };
    const postcode = d.addressComponents?.find((c) => c.types.includes("postal_code"))?.longText;
    return d.formattedAddress ? { id, label: d.formattedAddress.replace(/, New Zealand$/, ""), postcode } : null;
  }
  return null;
}

function dedupe(list: AddressSuggestion[]) {
  const seen = new Set<string>();
  return list.filter((a) => (seen.has(a.label) ? false : (seen.add(a.label), true)));
}
