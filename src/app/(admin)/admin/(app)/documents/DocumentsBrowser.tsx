"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/portal/Icon";
import { DownloadButton, EmptyState } from "@/components/portal/ui";
import { formatDate } from "@/lib/portal/status";

type Row = {
  id: string;
  name: string;
  issued: string;
  file?: string;
  product: string;
  insured: string;
  policyNumber: string;
  broker: string;
  policyHref: string;
};

export function DocumentsBrowser({ rows, productTabs }: { rows: Row[]; productTabs: { key: string; label: string }[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const product = productTabs.some((t) => t.key === params.get("product")) ? params.get("product")! : "";
  const q = query.trim().toLowerCase();
  const visible = rows.filter(
    (r) => (!product || r.product === product) && (!q || `${r.name} ${r.insured} ${r.policyNumber} ${r.broker}`.toLowerCase().includes(q)),
  );

  return (
    <div>
      <div role="tablist" aria-label="Product" className="-mx-5 mb-6 flex gap-1 overflow-x-auto border-b border-[#e3e3e3] px-5 md:mx-0 md:px-0">
        {[{ key: "", label: "All products" }, ...productTabs].map((t) => {
          const on = t.key === product;
          return (
            <button
              key={t.key || "all"}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => router.replace(t.key ? `${pathname}?product=${t.key}` : pathname, { scroll: false })}
              className={`-mb-px flex shrink-0 items-center gap-2 border-b-2 px-4 pt-2 pb-3.5 text-[14px] whitespace-nowrap ${
                on ? "border-site-teal font-medium text-[#2e7d74]" : "border-transparent text-body hover:text-charcoal"
              }`}
            >
              {t.label}
              <span className={`rounded-full px-2 py-0.5 text-[11px] ${on ? "bg-[#e6f4f2] text-[#2e7d74]" : "bg-[#eee] text-[#666]"}`}>
                {rows.filter((r) => !t.key || r.product === t.key).length}
              </span>
            </button>
          );
        })}
      </div>
      <label className="relative block">
        <span className="sr-only">Search documents</span>
        <Icon name="search" className="pointer-events-none absolute top-1/2 left-3.5 h-5 w-5 -translate-y-1/2 text-[#999]" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search document, insured, policy or broker"
          className="w-full border border-[#d9d9d9] bg-white py-3 pr-4 pl-11 text-[15px] text-charcoal outline-none focus:border-site-teal"
        />
      </label>
      <div className="mt-6 rounded-sm border border-[#eaeaea] bg-white">
        {visible.length === 0 ? (
          <EmptyState title="No documents match" />
        ) : (
          <ul className="divide-y divide-[#eaeaea]">
            {visible.map((r) => (
              <li key={r.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center">
                <span className="hidden h-11 w-9 shrink-0 items-center justify-center rounded-sm bg-[#e6f4f2] text-[10px] font-bold text-[#2e7d74] sm:flex">PDF</span>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-medium text-charcoal">
                    {r.name} · <Link href={r.policyHref} className="hover:text-site-teal">{r.insured}</Link>
                  </p>
                  <p className="text-[13px] text-body">
                    {r.policyNumber} · {r.broker} · Issued {formatDate(r.issued)}
                  </p>
                </div>
                <DownloadButton file={r.file} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
