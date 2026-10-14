import type { Metadata } from "next";
import { Icon } from "@/components/portal/Icon";
import { Card, PageHeader } from "@/components/portal/ui";
import { factSheetFor, policyWordings } from "@/content/documents";
import { portalWordings as copy } from "@/content/portal-pages";
import { products } from "@/content/products";
import { productName } from "@/lib/portal/products";

export const metadata: Metadata = { title: "Policy wordings" };

export default function WordingsPage() {
  return (
    <>
      <PageHeader title={copy.title} description={copy.intro} />
      <div className="space-y-8">
        {products.map((p) => {
          const sheet = factSheetFor(p.slug);
          const docs = [...policyWordings.filter((d) => d.productSlugs.includes(p.slug)), ...(sheet ? [sheet] : [])];
          return (
            <section key={p.slug}>
              <h2 className="mb-3 bg-site-blue px-5 py-3 font-heading text-[16px] font-semibold tracking-normal text-white">{productName(p.slug)}</h2>
              <Card>
                <ul className="divide-y divide-[#eaeaea]">
                  {docs.map((d) => (
                    <li key={d.file} className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center">
                      <div className="min-w-0 flex-1">
                        <p className="text-[15px] font-medium text-charcoal">
                          {d.title}
                          {d.edition && <span className="ml-2 text-[13px] font-normal text-body">{d.edition}</span>}
                        </p>
                        {d.productSlugs.length > 1 && (
                          <p className="mt-0.5 text-[12px] text-body">
                            {copy.appliesTo}: {d.productSlugs.map((s) => productName(s)).join(", ")}
                          </p>
                        )}
                      </div>
                      <a
                        href={d.file}
                        target="_blank"
                        rel="noopener"
                        className="inline-flex items-center gap-1.5 self-start border border-[#d6d6d6] bg-white px-3 py-2 text-[11px] font-medium tracking-[0.1em] whitespace-nowrap text-charcoal uppercase hover:border-site-teal hover:text-site-teal sm:self-auto"
                      >
                        <Icon name="documents" className="h-3.5 w-3.5" />
                        {d === sheet ? copy.viewSheet : copy.view}
                      </a>
                    </li>
                  ))}
                </ul>
              </Card>
            </section>
          );
        })}
        <p className="text-[13px] text-body">{copy.factSheets}</p>
      </div>
    </>
  );
}
