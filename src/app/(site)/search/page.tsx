import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Container, PageIntro } from "@/components/Mockup";
import { searchCopy } from "@/content/search";
import { search } from "@/lib/search";
import { buildSearchIndex } from "@/lib/search-index";

export const metadata: Metadata = { title: "Search" };

const index = buildSearchIndex();

export default function SearchPage(props: PageProps<"/search">) {
  return (
    <section className="pt-[118px] pb-[120px]">
      <Container className="max-w-[900px]">
        <PageIntro title="Search" />
        <Suspense fallback={<SearchForm query="" />}>
          <Results searchParams={props.searchParams} />
        </Suspense>
      </Container>
    </section>
  );
}

async function Results({ searchParams }: { searchParams: PageProps<"/search">["searchParams"] }) {
  const q = (await searchParams).q;
  const query = (Array.isArray(q) ? q[0] : q)?.slice(0, 100) ?? "";
  const results = search(index, query);
  return (
    <>
      <SearchForm query={query} />
      {query && (
        <p className="mt-8 text-[14px] text-body" aria-live="polite">
          {results.length === 0 ? searchCopy.empty : `${results.length} ${results.length === 1 ? "result" : "results"} for "${query}"`}
        </p>
      )}
      <ul className="mt-6 divide-y divide-[#eaeaea] border-t border-[#eaeaea]">
        {results.map((r) => (
          <li key={r.href}>
            <Link href={r.href} className="group block py-6">
              <span className="text-[12px] font-medium tracking-[0.12em] text-body uppercase">{r.section}</span>
              <span className="mt-1 block font-heading text-[22px] font-semibold text-charcoal group-hover:text-site-teal">{r.title}</span>
              <span className="mt-2 block text-[15px] leading-relaxed text-body">{r.snippet}</span>
            </Link>
          </li>
        ))}
      </ul>
      {!query && (
        <div className="mt-10 text-center">
          <p className="text-[14px] text-body">Popular searches</p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {searchCopy.popular.map((p) => (
              <Link key={p} href={`/search?q=${encodeURIComponent(p)}`} className="border border-[#d9d9d9] px-4 py-2 text-[14px] text-charcoal hover:border-site-teal hover:text-site-teal">
                {p}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function SearchForm({ query }: { query: string }) {
  return (
    <form action="/search" role="search" className="mt-10 flex">
      <label htmlFor="search-page-q" className="sr-only">
        Search the Otta website
      </label>
      <input
        id="search-page-q"
        name="q"
        type="search"
        defaultValue={query}
        placeholder={searchCopy.placeholder}
        className="min-w-0 flex-1 border border-[#d9d9d9] px-5 py-4 text-[16px] text-charcoal outline-none focus:border-site-teal focus:ring-2 focus:ring-[#e6f4f2]"
      />
      <button type="submit" className="bg-site-teal px-8 text-[12px] font-medium tracking-[0.12em] text-white uppercase hover:bg-[#4fa99c]">
        Search
      </button>
    </form>
  );
}
