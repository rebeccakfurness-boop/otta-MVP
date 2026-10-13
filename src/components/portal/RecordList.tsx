"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Icon } from "./Icon";
import { EmptyState, StatusBadge } from "./ui";

export type RecordRow = {
  id: string;
  href: string;
  status: string;
  /** Text searched by the filter box. */
  search: string;
  cells: ReactNode[];
};

/**
 * Searchable, status-filterable list used by Quote requests and Policies.
 * A table on desktop, stacked cards on mobile. Whole rows are links.
 */
export function RecordList({
  columns,
  rows,
  statuses,
  searchPlaceholder,
  emptyTitle,
}: {
  columns: string[];
  rows: RecordRow[];
  statuses: { key: string; label: string; match: string[] }[];
  searchPlaceholder: string;
  emptyTitle: string;
}) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const active = statuses.find((s) => s.key === params.get("status")) ?? statuses[0];

  function setStatus(key: string) {
    router.replace(key === statuses[0].key ? pathname : `${pathname}?status=${key}`, { scroll: false });
  }

  const q = query.trim().toLowerCase();
  const visible = rows.filter((r) => (active.match.length === 0 || active.match.includes(r.status)) && (!q || r.search.toLowerCase().includes(q)));

  return (
    <div>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
          {statuses.map((s) => {
            const count = rows.filter((r) => s.match.length === 0 || s.match.includes(r.status)).length;
            const on = s.key === active.key;
            return (
              <button
                key={s.key}
                type="button"
                aria-pressed={on}
                onClick={() => setStatus(s.key)}
                className={`border px-3.5 py-2 text-[13px] transition-colors ${
                  on ? "border-site-teal bg-site-teal text-white" : "border-[#d9d9d9] bg-white text-charcoal hover:border-site-teal"
                }`}
              >
                {s.label} <span className={on ? "text-white/80" : "text-[#999]"}>({count})</span>
              </button>
            );
          })}
        </div>
        <label className="relative lg:w-80">
          <span className="sr-only">Search</span>
          <Icon name="search" className="pointer-events-none absolute top-1/2 left-3.5 h-5 w-5 -translate-y-1/2 text-[#999]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full border border-[#d9d9d9] bg-white py-2.5 pr-4 pl-11 text-[14px] text-charcoal outline-none focus:border-site-teal"
          />
        </label>
      </div>

      <div className="mt-6 rounded-sm border border-[#eaeaea] bg-white">
        {visible.length === 0 ? (
          <EmptyState title={emptyTitle}>Try a different search or status.</EmptyState>
        ) : (
          <>
            {/* Desktop table */}
            <table className="hidden w-full text-left md:table">
              <thead>
                <tr className="border-b border-[#eaeaea]">
                  {columns.map((c) => (
                    <th key={c} scope="col" className="px-5 py-3.5 text-[11px] font-semibold tracking-[0.1em] text-body uppercase">
                      {c}
                    </th>
                  ))}
                  <th scope="col" className="px-5 py-3.5 text-[11px] font-semibold tracking-[0.1em] text-body uppercase">
                    Status
                  </th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eaeaea]">
                {visible.map((r) => (
                  <tr key={r.id} className="group relative cursor-pointer hover:bg-footer">
                    {r.cells.map((cell, i) => (
                      <td key={i} className={`px-5 py-4 text-[14px] ${i === 0 ? "font-medium text-charcoal" : "text-body"}`}>
                        {i === 0 ? (
                          <Link href={r.href} className="after:absolute after:inset-0">
                            {cell}
                          </Link>
                        ) : (
                          cell
                        )}
                      </td>
                    ))}
                    <td className="px-5 py-4">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="pr-5 text-[#bbb] group-hover:text-site-teal">
                      <Icon name="arrow" className="h-4 w-4" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile cards */}
            <ul className="divide-y divide-[#eaeaea] md:hidden">
              {visible.map((r) => (
                <li key={r.id}>
                  <Link href={r.href} className="block px-5 py-4 hover:bg-footer">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-[15px] font-medium text-charcoal">{r.cells[0]}</p>
                      <StatusBadge status={r.status} />
                    </div>
                    <p className="mt-1 text-[13px] text-body">{r.cells.slice(1).filter(Boolean).join(" · ")}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
