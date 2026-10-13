"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Icon } from "@/components/portal/Icon";
import { DownloadButton, EmptyState } from "@/components/portal/ui";
import type { FormType, PortalForm } from "@/lib/portal/types";
import { formatDate } from "@/lib/portal/status";

const tabs: { key: string; label: string; type?: FormType }[] = [
  { key: "all", label: "All forms" },
  { key: "proposal", label: "Proposal forms", type: "Proposal form" },
  { key: "renewal", label: "Renewal declarations", type: "Renewal declaration" },
  { key: "claim", label: "Claim forms", type: "Claim form" },
  { key: "general", label: "General", type: "General" },
];

export function FormsBrowser({ forms, products }: { forms: PortalForm[]; products: { slug: string; name: string }[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const tab = tabs.find((t) => t.key === params.get("type")) ?? tabs[0];
  const product = params.get("product") ?? "";
  const [query, setQuery] = useState("");

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value && value !== "all") next.set(key, value);
    else next.delete(key);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  const productNames = useMemo(() => Object.fromEntries(products.map((p) => [p.slug, p.name])), [products]);

  const filtered = forms.filter((f) => {
    if (tab.type && f.type !== tab.type) return false;
    if (product && f.productSlug !== product) return false;
    const q = query.trim().toLowerCase();
    if (q && !`${f.title} ${f.type} ${productNames[f.productSlug ?? ""] ?? ""}`.toLowerCase().includes(q)) return false;
    return true;
  });

  // Group results by product, with general forms last.
  const groups = [...products.map((p) => ({ key: p.slug, name: p.name })), { key: "", name: "General forms" }]
    .map((g) => ({ ...g, items: filtered.filter((f) => (f.productSlug ?? "") === g.key) }))
    .filter((g) => g.items.length > 0);

  const countFor = (t: (typeof tabs)[number]) =>
    forms.filter((f) => (!t.type || f.type === t.type) && (!product || f.productSlug === product)).length;

  return (
    <div>
      {/* Type tabs */}
      <div role="tablist" aria-label="Form type" className="-mx-5 flex gap-1 overflow-x-auto border-b border-[#e3e3e3] px-5 md:mx-0 md:px-0">
        {tabs.map((t) => {
          const active = t.key === tab.key;
          return (
            <button
              key={t.key}
              role="tab"
              aria-selected={active}
              type="button"
              onClick={() => setParam("type", t.key)}
              className={`-mb-px flex shrink-0 items-center gap-2 border-b-2 px-4 pt-2 pb-3.5 text-[14px] whitespace-nowrap transition-colors ${
                active ? "border-site-teal font-medium text-[#2e7d74]" : "border-transparent text-body hover:text-charcoal"
              }`}
            >
              {t.label}
              <span className={`rounded-full px-2 py-0.5 text-[11px] ${active ? "bg-[#e6f4f2] text-[#2e7d74]" : "bg-[#eee] text-[#666]"}`}>
                {countFor(t)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search and product filter */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Search forms</span>
          <Icon name="search" className="pointer-events-none absolute top-1/2 left-3.5 h-5 w-5 -translate-y-1/2 text-[#999]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search forms, e.g. landlord claim"
            className="w-full border border-[#d9d9d9] bg-white py-3 pr-4 pl-11 text-[15px] text-charcoal outline-none focus:border-site-teal"
          />
        </label>
        <label className="sm:w-72">
          <span className="sr-only">Product</span>
          <select
            value={product}
            onChange={(e) => setParam("product", e.target.value)}
            className="w-full border border-[#d9d9d9] bg-white px-4 py-3 text-[15px] text-charcoal outline-none focus:border-site-teal"
          >
            <option value="">All products</option>
            {products.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Results */}
      <div className="mt-8 space-y-8">
        {groups.length === 0 && (
          <div className="rounded-sm border border-[#eaeaea] bg-white">
            <EmptyState title="No forms match">Try a different search, or clear the filters.</EmptyState>
          </div>
        )}
        {groups.map((g) => (
          <section key={g.key || "general"}>
            <h2 className="mb-3 font-heading text-[17px] font-semibold tracking-normal text-charcoal">{g.name}</h2>
            <ul className="divide-y divide-[#eaeaea] rounded-sm border border-[#eaeaea] bg-white">
              {g.items.map((f) => (
                <li key={f.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center">
                  <span className="hidden h-11 w-9 shrink-0 items-center justify-center rounded-sm bg-[#e6f4f2] text-[10px] font-bold text-[#2e7d74] sm:flex">
                    PDF
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-medium text-charcoal">{f.title}</p>
                    <p className="text-[13px] text-body">
                      {f.type} · Updated {formatDate(f.updated)}
                    </p>
                  </div>
                  <DownloadButton file={f.file} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
