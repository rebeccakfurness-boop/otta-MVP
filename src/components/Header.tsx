"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
    setExpanded(null);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-cloud bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-6 px-5 md:px-8">
        <Logo className="h-9 w-auto" />

        {/* Desktop navigation */}
        <nav aria-label="Main" className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((item) => (
              <li key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className={`flex items-center gap-1 rounded-md px-3 py-2 text-[15px] font-semibold transition-colors hover:text-ocean-700 ${
                    isActive(pathname, item.href) ? "text-ocean-700" : "text-ink"
                  }`}
                >
                  {item.label}
                  {item.children && (
                    <Chevron className="transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />
                  )}
                </Link>
                {item.children && (
                  <div className="invisible absolute top-full left-0 pt-2 opacity-0 transition-all group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                    <ul className="min-w-72 rounded-xl border border-cloud bg-white p-2 shadow-xl shadow-ink/5">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className={`block rounded-lg px-4 py-2.5 text-sm font-medium transition-colors hover:bg-ocean-50 hover:text-ocean-800 ${
                              pathname === child.href ? "bg-ocean-50 text-ocean-800" : "text-ink"
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
          className="ml-auto hidden rounded-full bg-ocean-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ocean-800 sm:inline-flex lg:ml-2"
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
        <nav id="mobile-nav" aria-label="Mobile" className="max-h-[calc(100vh-5rem)] overflow-y-auto border-t border-cloud bg-white lg:hidden">
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
              className="block rounded-full bg-ocean-700 px-5 py-3 text-center font-semibold text-white"
            >
              Account Login
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
