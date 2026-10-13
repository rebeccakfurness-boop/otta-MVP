import "server-only";
import { products } from "@/content/products";
import { searchPages } from "@/content/search";
import { site } from "@/content/site";
import { team } from "@/content/team";
import type { SearchEntry } from "./search";

// Builds the website search index from the content files, so it stays in step
// with the site. Served as /search-index.json for the header search.

const flat = (v: unknown): string =>
  typeof v === "string" ? v : Array.isArray(v) ? v.map(flat).join(" ") : v && typeof v === "object" ? Object.values(v).map(flat).join(" ") : "";

export function buildSearchIndex(): SearchEntry[] {
  const pages = searchPages.map((p) => ({ ...p, keywords: p.keywords ?? "" }));
  // Contact details people search for directly.
  const contact = pages.find((p) => p.href === "/contact");
  if (contact) contact.keywords += ` ${site.phone} ${site.email} ${site.address.join(" ")}`;
  const teamPage = pages.find((p) => p.href === "/about-us/our-team");
  if (teamPage) teamPage.keywords += ` ${team.map((m) => `${m.name} ${m.role}`).join(" ")}`;

  const productEntries = products.map((p) => ({
    title: p.name,
    href: `/solutions/${p.slug}`,
    section: "Solutions",
    text: [p.summary, p.overview, flat(p.intro)].join(" "),
    keywords: [p.shortName, flat(p.atAGlance), flat(p.statements), flat(p.coverage), flat(p.keyExclusions), p.coverageTagline, "claim", flat(p.claim.paragraphs), p.claim.emergencyPhone ?? ""].join(" "),
  }));
  return [...pages, ...productEntries];
}

