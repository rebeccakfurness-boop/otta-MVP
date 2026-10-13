import { buildSearchIndex } from "@/lib/search-index";

// The website search index, built at deploy time and fetched by the header
// search the first time it opens.
export async function GET() {
  return Response.json(buildSearchIndex());
}
