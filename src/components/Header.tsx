"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { mainNav, site } from "@/content/site";
import { Logo } from "./Logo";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 20 20" className={`h-4 w-4 ${className}`} fill="currentColor">
      <path d="M5.3 7.3a1 1 0 0 1 1.4 0L10 10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4Z" />
    </svg>
  );
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  // Close the mobile menu after navigating.
  const [scrolled, setScrolled] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  // Large header at the top of the page, shrinking once the visitor scrolls.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
    setExpanded(null);
  }

  return (
    <>
    {/* Reserves the space the fixed header covers. */}
    <div aria-hidden className="h-16 lg:h-[92px]" />
    <header className="fixed inset-x-0 top-0 z-50 bg-white shadow-[0_1px_0_rgba(0,0,0,0.06)]">
      <div
        className={`mx-auto flex h-16 max-w-[1366px] items-center gap-6 px-5 transition-[height] duration-300 md:px-4 ${
          scrolled ? "lg:h-[50px]" : "lg:h-[92px]"
        }`}
      >
        <Logo
          className={`h-[26px] w-auto transition-[height] duration-300 ${scrolled ? "lg:h-[22px]" : "lg:h-[42px]"}`}
        />

        {/* Desktop navigation */}
        <nav aria-label="Main" className="ml-auto hidden self-stretch lg:block">
          <ul className="flex h-full items-center">
            {mainNav.map((item) => (
              <li key={item.href} className="group relative h-full">
                <Link
                  href={item.href}
                  className={`flex h-full items-center px-[16px] text-[15px] xl:px-[16.5px] tracking-[0.05em] transition-colors hover:text-[#8a8a8a] ${
                    isActive(pathname, item.href) ? "text-[#8a8a8a]" : "text-charcoal"
                  }`}
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="invisible absolute top-full left-0 opacity-0 transition-all group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                    <ul className="min-w-72 border-t-2 border-site-teal bg-white py-3 shadow-lg shadow-black/10">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className={`block px-6 py-2 text-[14px] tracking-[0.03em] transition-colors hover:text-site-teal ${
                              pathname === child.href ? "text-site-teal" : "text-charcoal"
                            }`}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <Link
          href={site.portalUrl}
          className="ml-auto hidden h-[43px] items-center border border-charcoal px-8 text-[15px] font-medium tracking-[0.12em] text-charcoal uppercase transition-colors hover:bg-charcoal hover:text-white sm:inline-flex lg:ml-[17px]"
        >
          Account Login
        </Link>

        <button
          type="button"
          className="ml-auto rounded-md p-2 text-ink sm:ml-0 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <svg aria-hidden viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {/* Mobile navigation */}
      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-cloud bg-white lg:hidden">
          <ul className="px-5 py-4">
            {mainNav.map((item) => (
              <li key={item.href} className="border-b border-cloud last:border-0">
                <div className="flex items-center">
                  <Link href={item.href} className="flex-1 py-3 font-semibold">
                    {item.label}
                  </Link>
                  {item.children && (
                    <button
                      type="button"
                      className="p-3"
                      aria-expanded={expanded === item.href}
                      onClick={() => setExpanded(expanded === item.href ? null : item.href)}
                    >
                      <span className="sr-only">Show {item.label} pages</span>
                      <Chevron className={expanded === item.href ? "rotate-180" : ""} />
                    </button>
                  )}
                </div>
                {item.children && expanded === item.href && (
                  <ul className="pb-3 pl-4">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link href={child.href} className="block py-2 text-sm text-muted">
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          <div className="px-5 pb-6 sm:hidden">
            <Link
              href={site.portalUrl}
              className="block border border-charcoal px-5 py-3 text-center font-medium tracking-[0.12em] text-charcoal uppercase"
            >
              Account Login
            </Link>
          </div>
        </nav>
      )}
    </header>
    </>
  );
}
