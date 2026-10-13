"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useState, type ReactNode } from "react";
import { portalPath } from "@/lib/portal/config";
import { Icon, type IconName } from "./Icon";

const nav: { label: string; path: string; icon: IconName }[] = [
  { label: "Dashboard", path: "/", icon: "home" },
  { label: "Forms", path: "/forms", icon: "forms" },
  { label: "Quote requests", path: "/quotes", icon: "quotes" },
  { label: "Policies", path: "/policies", icon: "policies" },
  { label: "Documents", path: "/documents", icon: "documents" },
  { label: "Help & contact", path: "/help", icon: "help" },
];

function NavLinks({ onNavigate, highlight = true }: { onNavigate: () => void; highlight?: boolean }) {
  return highlight ? <ActiveNavLinks onNavigate={onNavigate} /> : <NavList pathname={null} onNavigate={onNavigate} />;
}

function ActiveNavLinks({ onNavigate }: { onNavigate: () => void }) {
  return <NavList pathname={usePathname()} onNavigate={onNavigate} />;
}

function NavList({ pathname, onNavigate }: { pathname: string | null; onNavigate: () => void }) {
  const isActive = (path: string) => {
    if (!pathname) return false;
    const href = portalPath(path);
    return path === "/" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
  };
  return (
    <ul className="space-y-1">
      {nav.map((item) => {
        const active = isActive(item.path);
        return (
          <li key={item.path}>
            <Link
              href={portalPath(item.path)}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 border-l-[3px] px-4 py-3 text-[15px] transition-colors ${
                active
                  ? "border-site-teal bg-[#e6f4f2] font-medium text-[#2e7d74]"
                  : "border-transparent text-charcoal hover:bg-footer hover:text-site-teal"
              }`}
            >
              <Icon name={item.icon} />
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function PortalShell({ user, websiteUrl, children }: { user: ReactNode; websiteUrl: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="px-6 pt-7 pb-6">
        <Link href={portalPath("/")} onClick={close} className="inline-flex items-end gap-3" aria-label="Otta Broker Portal home">
          <Image src="/brand/otta-logo.png" alt="Otta" width={513} height={191} className="h-8 w-auto" priority />
          <span className="mb-[3px] text-[10px] font-semibold tracking-[0.2em] text-site-teal uppercase">Broker Portal</span>
        </Link>
      </div>
      <nav aria-label="Portal" className="flex-1 px-3">
        {/* The current-page highlight reads the URL, so it streams in. */}
        <Suspense fallback={<NavLinks onNavigate={close} highlight={false} />}>
          <NavLinks onNavigate={close} />
        </Suspense>
      </nav>
      <div className="border-t border-[#eaeaea] px-6 py-5">
        {user}
        <a href={websiteUrl} className="mt-4 inline-flex items-center gap-1.5 text-[12px] text-body hover:text-site-teal">
          <Icon name="external" className="h-3.5 w-3.5" />
          ottainsurance.co.nz
        </a>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-[272px] shrink-0 border-r border-[#eaeaea] bg-white lg:block">{sidebar}</aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="Close menu" className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-[280px] bg-white shadow-xl">{sidebar}</aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#eaeaea] bg-white px-5 lg:hidden">
          <Link href={portalPath("/")} className="inline-flex items-end gap-2">
            <Image src="/brand/otta-logo.png" alt="Otta" width={513} height={191} className="h-7 w-auto" />
            <span className="mb-[2px] text-[9px] font-semibold tracking-[0.2em] text-site-teal uppercase">Broker Portal</span>
          </Link>
          <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" className="p-2 text-charcoal">
            <Icon name="menu" className="h-6 w-6" />
          </button>
        </header>
        <main className="mx-auto w-full max-w-[1200px] flex-1 px-5 py-8 md:px-10 md:py-12">{children}</main>
      </div>
    </div>
  );
}
