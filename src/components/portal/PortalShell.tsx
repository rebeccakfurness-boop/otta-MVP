"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useState, type ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

export type NavItem = { label: string; href: string; icon: IconName };

type ShellProps = {
  /** Small label beside the logo, e.g. "Broker Portal". */
  label: string;
  labelClassName?: string;
  homeHref: string;
  nav: NavItem[];
  user: ReactNode;
  websiteUrl: string;
  children: ReactNode;
};

function NavLinks({ nav, homeHref, onNavigate, highlight = true }: { nav: NavItem[]; homeHref: string; onNavigate: () => void; highlight?: boolean }) {
  return highlight ? (
    <ActiveNavLinks nav={nav} homeHref={homeHref} onNavigate={onNavigate} />
  ) : (
    <NavList nav={nav} homeHref={homeHref} pathname={null} onNavigate={onNavigate} />
  );
}

function ActiveNavLinks(props: { nav: NavItem[]; homeHref: string; onNavigate: () => void }) {
  return <NavList {...props} pathname={usePathname()} />;
}

function NavList({ nav, homeHref, pathname, onNavigate }: { nav: NavItem[]; homeHref: string; pathname: string | null; onNavigate: () => void }) {
  const isActive = (href: string) => {
    if (!pathname) return false;
    return href === homeHref ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
  };
  return (
    <ul className="space-y-1">
      {nav.map((item) => {
        const active = isActive(item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
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

export function PortalShell({ label, labelClassName = "text-site-teal", homeHref, nav, user, websiteUrl, children }: ShellProps) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="px-6 pt-7 pb-6">
        <Link href={homeHref} onClick={close} className="inline-flex items-end gap-3" aria-label={`Otta ${label} home`}>
          <Image src="/brand/otta-logo.png" alt="Otta" width={513} height={191} className="h-8 w-auto" priority />
          <span className={`mb-[3px] text-[10px] font-semibold tracking-[0.2em] uppercase ${labelClassName}`}>{label}</span>
        </Link>
      </div>
      <nav aria-label="Portal" className="flex-1 px-3">
        {/* The current-page highlight reads the URL, so it streams in. */}
        <Suspense fallback={<NavLinks nav={nav} homeHref={homeHref} onNavigate={close} highlight={false} />}>
          <NavLinks nav={nav} homeHref={homeHref} onNavigate={close} />
        </Suspense>
      </nav>
      <div className="border-t border-[#eaeaea] px-6 py-5">
        {user}
        <a href={websiteUrl} target="_blank" rel="noopener" className="mt-4 inline-flex items-center gap-1.5 text-[12px] text-body hover:text-site-teal">
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
          <Link href={homeHref} className="inline-flex items-end gap-2">
            <Image src="/brand/otta-logo.png" alt="Otta" width={513} height={191} className="h-7 w-auto" />
            <span className={`mb-[2px] text-[9px] font-semibold tracking-[0.2em] uppercase ${labelClassName}`}>{label}</span>
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
