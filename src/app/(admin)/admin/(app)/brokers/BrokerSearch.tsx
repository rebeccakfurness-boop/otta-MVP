"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/portal/Icon";
import { EmptyState } from "@/components/portal/ui";

type Broker = {
  id: string;
  name: string;
  href: string;
  viewHref: string;
  domains: string[];
  users: { name: string; email: string }[];
  stats: string[];
};

export function BrokerSearch({ brokers }: { brokers: Broker[] }) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const results = brokers
    .map((b) => {
      const brokerMatch = !q || `${b.name} ${b.domains.join(" ")}`.toLowerCase().includes(q);
      const users = q ? b.users.filter((u) => `${u.name} ${u.email}`.toLowerCase().includes(q)) : [];
      return { ...b, show: brokerMatch || users.length > 0, matchedUsers: users };
    })
    .filter((b) => b.show);

  return (
    <div>
      <label className="relative block">
        <span className="sr-only">Search brokers</span>
        <Icon name="search" className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[#999]" />
        <input
          type="search"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search brokerage, broker name or email"
          className="w-full border border-[#d9d9d9] bg-white py-4 pr-4 pl-12 text-[16px] text-charcoal outline-none focus:border-site-teal"
        />
      </label>

      <div className="mt-6 space-y-4">
        {results.length === 0 && (
          <div className="rounded-sm border border-[#eaeaea] bg-white">
            <EmptyState title="No brokers match">Try a brokerage name, a broker&apos;s name or their email address.</EmptyState>
          </div>
        )}
        {results.map((b) => (
          <article key={b.id} className="rounded-sm border border-[#eaeaea] bg-white">
            <div className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center">
              <div className="min-w-0 flex-1">
                <Link href={b.href} className="font-heading text-[19px] font-semibold text-charcoal hover:text-site-teal">
                  {b.name}
                </Link>
                <p className="mt-1 text-[13px] text-body">
                  {b.stats.join(" · ")} · {b.users.length} {b.users.length === 1 ? "user" : "users"}
                </p>
                {b.matchedUsers.length > 0 && (
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {b.matchedUsers.map((u) => (
                      <li key={u.email} className="rounded-sm bg-[#e6f4f2] px-2.5 py-1 text-[12px] text-[#2e7d74]">
                        {u.name} · {u.email}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex gap-2">
                <Link href={b.viewHref} className="inline-flex items-center gap-2 border border-[#d6d6d6] bg-white px-4 py-2.5 text-[12px] font-medium tracking-[0.12em] text-charcoal uppercase hover:border-site-teal hover:text-site-teal">
                  <Icon name="eye" className="h-4 w-4" />
                  Broker view
                </Link>
                <Link href={b.href} className="inline-flex items-center gap-2 bg-site-teal px-4 py-2.5 text-[12px] font-medium tracking-[0.12em] text-white uppercase hover:bg-[#4fa99c]">
                  Open
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
