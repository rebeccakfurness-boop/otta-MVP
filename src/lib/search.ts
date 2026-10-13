// Website search. The index is plain data built from the content files, so it
// stays in step with the site. Matching runs in the browser (instant results)
// and on the /search page.

export type SearchEntry = { title: string; href: string; section: string; text: string; keywords: string };
export type SearchResult = SearchEntry & { score: number; snippet: string };

const normalise = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u2019']/g, "");

const terms = (q: string) =>
  normalise(q)
    .split(/[^a-z0-9$]+/)
    .filter((t) => t.length > 1 || /\d/.test(t));

function snippet(text: string, words: string[]) {
  const lower = normalise(text);
  const hit = Math.min(...words.map((w) => lower.indexOf(w)).filter((i) => i >= 0), Infinity);
  if (!Number.isFinite(hit) || hit < 80) return text.length > 180 ? `${text.slice(0, 180).replace(/\s+\S*$/, "")}...` : text;
  const start = text.lastIndexOf(" ", hit - 60) + 1;
  const piece = text.slice(start, start + 180).replace(/\s+\S*$/, "");
  return `...${piece}${start + 180 < text.length ? "..." : ""}`;
}

/** Results for a query, best first. Every word must appear somewhere. */
export function search(index: SearchEntry[], query: string, limit = 20): SearchResult[] {
  const words = terms(query);
  if (words.length === 0) return [];
  const results: SearchResult[] = [];
  for (const entry of index) {
    const title = normalise(entry.title);
    const body = normalise(`${entry.text} ${entry.section}`);
    const keys = normalise(entry.keywords);
    let score = 0;
    let all = true;
    for (const w of words) {
      // Allow simple plurals and prefixes ("landlords", "wordin").
      const stem = w.length > 4 && w.endsWith("s") ? w.slice(0, -1) : w;
      const inTitle = title.includes(stem);
      const inBody = body.includes(stem);
      const inKeys = keys.includes(stem);
      if (!inTitle && !inBody && !inKeys) {
        all = false;
        break;
      }
      score += (inTitle ? 10 : 0) + (title.startsWith(stem) ? 5 : 0) + (inKeys ? 3 : 0) + (inBody ? 2 : 0);
    }
    if (!all) continue;
    if (title === normalise(query.trim())) score += 20;
    results.push({ ...entry, score, snippet: snippet(entry.text, words) });
  }
  return results.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title)).slice(0, limit);
}
