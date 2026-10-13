import Link from "next/link";
import { site, solutionsNav, resourcesNav } from "@/content/site";
import { Logo } from "./Logo";

export async function Footer() {
  const year = await copyrightYear();
  return (
    <footer className="bg-ocean-800 text-ocean-50">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-12 md:px-8">
        <div className="md:col-span-4">
          <Logo variant="white" tagline className="h-20 w-auto" />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-ocean-100">
            Simple insurance solutions for complex problems, backed by the global strength of
            Lloyd&apos;s of London.
          </p>
          <ul className="mt-6 flex gap-5 text-sm font-semibold">
            <li>
              <Link href="/fair-insurance-code" className="hover:text-white hover:underline">
                Fair Insurance Code
              </Link>
            </li>
            <li>
              <Link href="/complaints" className="hover:text-white hover:underline">
                Complaints
              </Link>
            </li>
          </ul>
        </div>

        <FooterList title="Solutions" items={solutionsNav} className="md:col-span-3" />
        <FooterList title="Resources" items={resourcesNav} className="md:col-span-2" />

        <div className="text-sm md:col-span-3">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-white">Our Address</h2>
          <address className="not-italic leading-relaxed text-ocean-100">
            {site.address.map((line) => (
              <div key={line}>{line}</div>
            ))}
          </address>
          <p className="mt-4 text-ocean-100">
            T:{" "}
            <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-white">
              {site.phone}
            </a>
            <br />
            E:{" "}
            <a href={`mailto:${site.email}`} className="hover:text-white">
              {site.email}
            </a>
          </p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-6 text-xs text-ocean-100 md:flex-row md:justify-between md:px-8">
          <p>© {year} Otta. All rights reserved.</p>
          <p>Insurance that works.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterList({
  title,
  items,
  className,
}: {
  title: string;
  items: { label: string; href: string }[];
  className?: string;
}) {
  return (
    <div className={className}>
      <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-white">{title}</h2>
      <ul className="space-y-2.5 text-sm">
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="text-ocean-100 hover:text-white hover:underline">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

async function copyrightYear() {
  "use cache";
  return new Date().getFullYear();
}
