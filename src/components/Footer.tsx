import Link from "next/link";
import { site, solutionsNav } from "@/content/site";
import { Logo } from "./Logo";

export async function Footer() {
  const year = await copyrightYear();
  return (
    <footer className="text-[14px]">
      <div className="bg-footer">
        <div className="mx-auto grid max-w-[1366px] gap-10 px-5 pt-[72px] pb-[72px] md:grid-cols-12 md:px-4">
          <div className="md:col-span-6 md:pr-12">
            <Logo className="h-[34px] w-auto" />
            <p className="mt-6 text-[14px] leading-[1.65] text-body">
              At Otta we provide simple insurance solutions for complex problems so your business,
              life and investments can benefit from stability, confidence and continuity.
              Comprehensive coverage backed by global strength and certainty delivered through
              Lloyd&apos;s of London.
            </p>
            <ul className="mt-6 space-y-1 text-charcoal">
              <li>
                <Link href="/fair-insurance-code" className="hover:text-site-teal">
                  Fair Insurance Code
                </Link>
              </li>
              <li>
                <Link href="/complaints" className="hover:text-site-teal">
                  Complaints
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 md:pt-[54px]">
            <h2 className="font-sans text-[14px] font-semibold tracking-normal text-charcoal">Solutions</h2>
            <ul className="mt-0.5 space-y-[3px]">
              {solutionsNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-charcoal hover:text-site-teal">
                    {item.label.replace("Housing Insurance", "Housing")}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3 md:pt-[54px]">
            <h2 className="font-sans text-[14px] font-semibold tracking-normal text-charcoal">Our Address</h2>
            <address className="mt-0.5 space-y-[3px] not-italic text-body">
              {site.address.map((line) => (
                <div key={line}>{line}</div>
              ))}
              <div>
                T:{" "}
                <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-site-teal">
                  {site.phone}
                </a>
              </div>
              <div>
                E:{" "}
                <a href={`mailto:${site.email}`} className="text-charcoal hover:text-site-teal">
                  {site.email}
                </a>
              </div>
            </address>
          </div>
        </div>
      </div>
      <div className="bg-white">
        <div className="mx-auto max-w-[1366px] px-5 py-7 text-body md:px-4">
          © {year} Otta. All rights reserved
        </div>
      </div>
    </footer>
  );
}

async function copyrightYear() {
  "use cache";
  return new Date().getFullYear();
}
