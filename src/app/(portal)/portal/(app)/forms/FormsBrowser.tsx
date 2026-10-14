"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Icon } from "@/components/portal/Icon";
import { DownloadButton, EmptyState } from "@/components/portal/ui";
import type { FormType, PortalForm } from "@/lib/portal/types";
import { formatDate } from "@/lib/portal/status";

const tabs: { key: string; label: string; type?: FormType }[] = [
  { key: "all", label: "All forms" },
  { key: "proposal", label: "Proposal forms", type: "Proposal form" },
  {
    key: "renewal",
    label: "Renewal declarations",
    type: "Renewal declaration",
  },
  { key: "claim", label: "Claim forms", type: "Claim form" },
  { key: "general", label: "General", type: "General" },
];

/** A form brokers can fill in online (or send to a client). */
export type OnlineFormLink = {
  id: string;
  title: string;
  summary: string;
  type: FormType;
  productSlugs: string[];
  href: string;
  sendHref: string;
};

export function FormsBrowser({
  forms,
  online = [],
  products,
}: {
  forms: PortalForm[];
  /** The online forms, shown first in their section (the broker portal only). */
  online?: OnlineFormLink[];
  products: { slug: string; name: string }[];
}) {
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

  const productNames = useMemo(
    () => Object.fromEntries(products.map((p) => [p.slug, p.name])),
    [products],
  );

  const q = query.trim().toLowerCase();
  const matches = (text: string) => !q || text.toLowerCase().includes(q);
  // A PDF is left out when an online form already covers its product and type.
  const coveredOnline = (f: PortalForm) =>
    online.some(
      (o) =>
        o.type === f.type &&
        !!f.productSlug &&
        o.productSlugs.includes(f.productSlug),
    );
  const filtered = forms.filter(
    (f) =>
      !coveredOnline(f) &&
      (!tab.type || f.type === tab.type) &&
      (!product || f.productSlug === product) &&
      matches(
        `${f.title} ${f.type} ${productNames[f.productSlug ?? ""] ?? ""}`,
      ),
  );
  const filteredOnline = online.filter(
    (f) =>
      (!tab.type || f.type === tab.type) &&
      (!product || f.productSlugs.includes(product)) &&
      matches(
        `${f.title} ${f.type} ${f.summary} ${f.productSlugs.map((s) => productNames[s]).join(" ")}`,
      ),
  );

  // One section per kind of form: its online forms first, then the PDFs by product.
  const sections = tabs
    .filter((t) => t.type)
    .map((t) => ({
      ...t,
      online: filteredOnline.filter((f) => f.type === t.type),
      groups: [
        ...products.map((p) => ({ key: p.slug, name: p.name })),
        { key: "", name: "General forms" },
      ]
        .map((g) => ({
          ...g,
          items: filtered.filter(
            (f) => f.type === t.type && (f.productSlug ?? "") === g.key,
          ),
        }))
        .filter((g) => g.items.length > 0),
    }))
    .filter((s) => s.online.length > 0 || s.groups.length > 0);

  const countFor = (t: (typeof tabs)[number]) =>
    forms.filter(
      (f) =>
        !coveredOnline(f) &&
        (!t.type || f.type === t.type) &&
        (!product || f.productSlug === product),
    ).length +
    online.filter(
      (f) =>
        (!t.type || f.type === t.type) &&
        (!product || f.productSlugs.includes(product)),
    ).length;

  return (
    <div>
      {/* Type tabs */}
      <div
        role="tablist"
        aria-label="Form type"
        className="-mx-5 flex gap-1 overflow-x-auto border-b border-[#e3e3e3] px-5 md:mx-0 md:px-0"
      >
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
                active
                  ? "border-site-teal font-medium text-[#2e7d74]"
                  : "border-transparent text-body hover:text-charcoal"
              }`}
            >
              {t.label}
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] ${active ? "bg-[#e6f4f2] text-[#2e7d74]" : "bg-[#eee] text-[#666]"}`}
              >
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
          <Icon
            name="search"
            className="pointer-events-none absolute top-1/2 left-3.5 h-5 w-5 -translate-y-1/2 text-[#999]"
          />
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

      {/* Results, by kind of form */}
      <div className="mt-8 space-y-12">
        {sections.length === 0 && (
          <div className="rounded-sm border border-[#eaeaea] bg-white">
            <EmptyState title="No forms match">
              Try a different search, or clear the filters.
            </EmptyState>
          </div>
        )}
        {sections.map((section) => (
          <section key={section.key} aria-labelledby={`forms-${section.key}`}>
            <h2
              id={`forms-${section.key}`}
              className="flex items-center justify-between bg-site-blue px-5 py-3.5 font-heading text-[18px] font-semibold tracking-normal text-white"
            >
              {section.label}
              <span className="text-[12px] font-normal tracking-[0.1em] text-white/80 uppercase">
                {((n) => `${n} ${n === 1 ? "form" : "forms"}`)(
                  section.online.length +
                    section.groups.reduce((n, g) => n + g.items.length, 0),
                )}
              </span>
            </h2>

            {section.online.length > 0 && (
              <div className="mt-4">
                <h3 className="mb-2 text-[12px] font-medium tracking-[0.14em] text-body uppercase">
                  Fill in online
                </h3>
                <ul className="space-y-3">
                  {section.online.map((f) => (
                    <li
                      key={f.id}
                      className="flex flex-col overflow-hidden rounded-sm sm:flex-row"
                    >
                      <Link
                        href={f.href}
                        className="group flex flex-1 items-center gap-4 bg-site-teal p-4 text-white transition-colors hover:bg-[#4fa99c] sm:p-5"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/70">
                          <Icon name="forms" className="h-5 w-5" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-heading text-[17px] font-bold">
                            {f.title}
                          </span>
                          <span className="mt-1 flex flex-wrap gap-1.5">
                            {f.productSlugs.map((s) => (
                              <span
                                key={s}
                                className="rounded-sm bg-white/20 px-2 py-0.5 text-[11px] font-medium tracking-[0.04em]"
                              >
                                {productNames[s] ?? s}
                              </span>
                            ))}
                          </span>
                        </span>
                        <Icon
                          name="arrow"
                          className="hidden h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1 sm:block"
                        />
                      </Link>
                      <Link
                        href={f.sendHref}
                        className="flex items-center justify-center gap-2 bg-[#2e7d74] px-6 py-3.5 text-[12px] font-medium tracking-[0.12em] text-white uppercase transition-colors hover:bg-[#256a62] sm:w-52"
                      >
                        <Icon name="send" className="h-4 w-4" />
                        Send to a client
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {section.groups.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-3 text-[12px] font-medium tracking-[0.14em] text-body uppercase">
                  Download
                </h3>
                <div className="space-y-6">
                  {section.groups.map((g) => (
                    <div key={g.key || "general"}>
                      <h4 className="mb-2 text-[15px] font-semibold text-charcoal">
                        {g.name}
                      </h4>
                      <ul className="divide-y divide-[#eaeaea] rounded-sm border border-[#eaeaea] bg-white">
                        {g.items.map((f) => (
                          <li
                            key={f.id}
                            className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center"
                          >
                            <span className="hidden h-11 w-9 shrink-0 items-center justify-center rounded-sm bg-[#e6f4f2] text-[10px] font-bold text-[#2e7d74] sm:flex">
                              PDF
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="text-[15px] font-medium text-charcoal">
                                {f.title}
                              </p>
                              <p className="text-[13px] text-body">
                                Updated {formatDate(f.updated)}
                              </p>
                            </div>
                            <DownloadButton file={f.file} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
