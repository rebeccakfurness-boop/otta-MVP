"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { searchCopy } from "@/content/search";
import { search, type SearchEntry } from "@/lib/search";

let indexPromise: Promise<SearchEntry[]> | null = null;
const loadIndex = () =>
  (indexPromise ??= fetch("/search-index.json")
    .then((r) => r.json() as Promise<SearchEntry[]>)
    .catch(() => {
      indexPromise = null;
      return [];
    }));

function SearchIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4" />
    </svg>
  );
}

/** Header search: a button that opens an instant-results search panel. */
export function SiteSearch({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false);

  // "/" opens search from anywhere on the page (unless typing in a field).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key === "/" && !open && !/INPUT|TEXTAREA|SELECT/.test(t.tagName) && !t.isContentEditable) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        onMouseEnter={() => void loadIndex()}
        className={`p-2 text-charcoal transition-colors hover:text-site-teal ${className}`}
        aria-label="Search the website"
        aria-haspopup="dialog"
      >
        <SearchIcon className="h-[22px] w-[22px]" />
      </button>
      {open && <SearchPanel onClose={() => setOpen(false)} />}
    </>
  );
}

function SearchPanel({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [index, setIndex] = useState<SearchEntry[] | null>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listId = useId();

  useEffect(() => {
    let live = true;
    loadIndex().then((i) => live && setIndex(i));
    inputRef.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      live = false;
      document.body.style.overflow = previous;
    };
  }, []);

  const results = index ? search(index, query, 8) : [];
  const go = (href: string) => {
    onClose();
    router.push(href);
  };

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") onClose();
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[active]) go(results[active].href);
      else if (query.trim()) go(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Search the website" onKeyDown={onKeyDown}>
      <button type="button" aria-label="Close search" tabIndex={-1} onClick={onClose} className="absolute inset-0 bg-charcoal/40" />
      <div className="relative mx-auto mt-0 w-full max-w-[760px] bg-white shadow-xl shadow-black/15 sm:mt-[12vh]">
        <div className="flex items-center gap-3 border-b-2 border-site-teal px-5">
          <SearchIcon className="h-5 w-5 shrink-0 text-site-teal" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            placeholder={searchCopy.placeholder}
            aria-label="Search"
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls={listId}
            aria-activedescendant={results[active] ? `${listId}-${active}` : undefined}
            aria-autocomplete="list"
            className="min-w-0 flex-1 py-5 text-[18px] text-charcoal outline-none placeholder:text-[#a6a6a6] [&::-webkit-search-cancel-button]:hidden"
          />
          <button type="button" onClick={onClose} className="px-2 py-1 text-[11px] font-medium tracking-[0.12em] text-body uppercase hover:text-charcoal">
            Esc
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {query.trim() === "" ? (
            <div className="px-5 py-5">
              <p className="text-[12px] font-medium tracking-[0.12em] text-body uppercase">Popular</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {searchCopy.popular.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      setQuery(p);
                      inputRef.current?.focus();
                    }}
                    className="border border-[#d9d9d9] px-3 py-1.5 text-[14px] text-charcoal hover:border-site-teal hover:text-site-teal"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          ) : index === null ? (
            <p className="px-5 py-6 text-[14px] text-body">Loading...</p>
          ) : results.length === 0 ? (
            <p className="px-5 py-6 text-[14px] text-body">{searchCopy.empty}</p>
          ) : (
            <ul id={listId} role="listbox" aria-label="Search results" className="py-2">
              {results.map((r, i) => (
                <li key={r.href} id={`${listId}-${i}`} role="option" aria-selected={i === active}>
                  <Link
                    href={r.href}
                    onClick={onClose}
                    onMouseEnter={() => setActive(i)}
                    className={`block border-l-4 px-5 py-3 ${i === active ? "border-site-teal bg-[#f1f8f7]" : "border-transparent"}`}
                  >
                    <span className="flex items-baseline justify-between gap-4">
                      <span className="font-heading text-[17px] font-semibold text-charcoal">{r.title}</span>
                      <span className="shrink-0 text-[11px] font-medium tracking-[0.12em] text-body uppercase">{r.section}</span>
                    </span>
                    <span className="mt-1 line-clamp-2 block text-[14px] leading-snug text-body">{r.snippet}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        {query.trim() && results.length > 0 && (
          <Link
            href={`/search?q=${encodeURIComponent(query.trim())}`}
            onClick={onClose}
            className="block border-t border-[#eaeaea] px-5 py-3 text-[12px] font-medium tracking-[0.12em] text-[#2e7d74] uppercase hover:bg-footer"
          >
            See all results for &ldquo;{query.trim()}&rdquo;
          </Link>
        )}
      </div>
    </div>
  );
}
