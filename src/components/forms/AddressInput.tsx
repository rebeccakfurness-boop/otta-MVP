"use client";

import { createContext, useContext, useEffect, useId, useRef, useState, type InputHTMLAttributes } from "react";

/** Where the form looks up address suggestions (differs on the website and portal). */
export const AddressSearchUrl = createContext<string | null>(null);

type Suggestion = { id: string; label: string; postcode?: string };

/** Sets an uncontrolled input's value so React's onChange (and the form) see it. */
function setNativeValue(el: HTMLInputElement, value: string) {
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(el, value);
  el.dispatchEvent(new Event("input", { bubbles: true }));
}

/**
 * A text input that suggests New Zealand addresses as you type. Choosing one
 * fills the field (and the post code field, if given). Typing freely, such as
 * a PO Box, still works.
 */
export function AddressInput({
  postcodeField,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { postcodeField?: string; id: string }) {
  const url = useContext(AddressSearchUrl);
  const inputRef = useRef<HTMLInputElement>(null);
  // The value we filled in from a suggestion, so it isn't searched again.
  const chosen = useRef<string | null>(null);
  const listId = useId();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [loading, setLoading] = useState(false);
  // One session per address lookup keeps Google Places billing per address.
  const session = useRef("");

  useEffect(() => {
    if (!url || query.trim().length < 3) return;
    session.current ||= Math.random().toString(36).slice(2);
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`${url}?q=${encodeURIComponent(query)}&s=${session.current}`, { signal: controller.signal });
        const data = (await res.json()) as { suggestions?: Suggestion[] };
        setResults(data.suggestions ?? []);
        setActive(-1);
        setOpen(true);
      } catch {
        // Aborted or offline: keep typing without suggestions.
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 220);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, url]);

  async function choose(s: Suggestion) {
    const input = inputRef.current!;
    setOpen(false);
    setResults([]);
    chosen.current = s.label;
    setNativeValue(input, s.label);
    let postcode = s.postcode;
    if (!postcode && postcodeField && url && !s.id.startsWith("osm:")) {
      try {
        const res = await fetch(`${url}?id=${encodeURIComponent(s.id)}&s=${session.current}`);
        const data = (await res.json()) as { address?: Suggestion | null };
        if (data.address) {
          chosen.current = data.address.label;
          setNativeValue(input, data.address.label);
          postcode = data.address.postcode;
        }
      } catch {
        // The post code can be typed in.
      }
    }
    if (postcode && postcodeField) {
      const pc = document.getElementById(`f-${postcodeField}`);
      if (pc instanceof HTMLInputElement) setNativeValue(pc, postcode);
    }
    session.current = "";
  }

  const showList = open && query.trim().length >= 3 && (results.length > 0 || !loading);

  return (
    <div className="relative">
      <input
        {...props}
        ref={inputRef}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={showList}
        aria-controls={listId}
        aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
        autoComplete="off"
        className={className}
        onChange={(e) => {
          if (e.target.value === chosen.current) return;
          chosen.current = null;
          setQuery(e.target.value);
          if (e.target.value.trim().length < 3) setOpen(false);
        }}
        onFocus={() => results.length > 0 && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        onKeyDown={(e) => {
          if (!showList || results.length === 0) return;
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActive((a) => (a + 1) % results.length);
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((a) => (a <= 0 ? results.length - 1 : a - 1));
          } else if (e.key === "Enter" && active >= 0) {
            e.preventDefault();
            void choose(results[active]);
          } else if (e.key === "Escape") {
            setOpen(false);
          }
        }}
      />
      {showList && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Address suggestions"
          className="absolute inset-x-0 top-full z-20 mt-1 max-h-72 overflow-y-auto border border-[#d9d9d9] bg-white py-1 shadow-lg shadow-black/10"
        >
          {results.length === 0 ? (
            <li className="px-4 py-3 text-[14px] text-body">No matching addresses. Keep typing to enter it in full.</li>
          ) : (
            results.map((r, i) => (
              <li
                key={r.id}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === active}
                onMouseDown={(e) => {
                  e.preventDefault();
                  void choose(r);
                }}
                onMouseEnter={() => setActive(i)}
                className={`flex cursor-pointer items-start gap-3 px-4 py-2.5 text-[14px] text-charcoal ${i === active ? "bg-[#f1f8f7]" : ""}`}
              >
                <svg aria-hidden viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-site-teal" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
                  <circle cx="12" cy="9.5" r="2.5" />
                </svg>
                {r.label}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
