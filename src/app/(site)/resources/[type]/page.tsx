import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, PageIntro } from "@/components/Mockup";
import { factSheetFor, wordingsFor } from "@/content/documents";
import { onlineForms } from "@/content/forms";
import { products } from "@/content/products";
import { resourcesNav } from "@/content/site";

// FAQs has its own page; every other Resources item is a list of documents.
const types = resourcesNav.filter((r) => r.href !== "/resources/faqs").map((r) => ({ type: r.href.split("/").pop()!, label: r.label }));

export function generateStaticParams() {
  return types.map(({ type }) => ({ type }));
}

export async function generateMetadata({ params }: PageProps<"/resources/[type]">): Promise<Metadata> {
  const { type } = await params;
  return { title: types.find((t) => t.type === type)?.label };
}

export default async function ResourceTypePage({ params }: PageProps<"/resources/[type]">) {
  const { type } = await params;
  const entry = types.find((t) => t.type === type);
  if (!entry) notFound();

  return (
    <section className="pt-[118px] pb-[120px]">
      <Container>
        <PageIntro title={entry.label}>
          <p>Download the {entry.label.toLowerCase()} for each Otta product.</p>
        </PageIntro>
        {/* Documents supplied so far; the rest show "Coming soon". */}
        <ul className="mx-auto mt-[72px] max-w-[1000px] space-y-4">
          {products.map((p) => {
            const docs = documentsFor(entry.type, p.slug);
            return (
              <li key={p.slug} id={p.slug} className="scroll-mt-28 rounded-sm bg-footer px-8 py-6">
                <p className="font-heading text-[20px] font-semibold text-charcoal">
                  <Link href={`/solutions/${p.slug}`} className="hover:text-site-teal">
                    {p.name}
                  </Link>
                </p>
                {docs.length === 0 ? (
                  <div className="mt-1 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-[14px] text-body">{entry.label}</p>
                    <span className="self-start bg-[#c9c9c9] px-6 py-[13px] text-[12px] font-medium tracking-[0.12em] text-white uppercase sm:self-auto">
                      Coming soon
                    </span>
                  </div>
                ) : (
                  <ul className="mt-2 divide-y divide-[#e3e3e3]">
                    {docs.map((d) => (
                      <li key={d.href} className="flex flex-col gap-3 py-3 first:pt-1 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-[14px] text-body">
                          {d.title}
                          {d.edition && <span className="text-[#9a9a9a]"> · {d.edition}</span>}
                        </p>
                        <a
                          href={d.href}
                          target="_blank"
                          rel="noreferrer"
                          className="self-start bg-site-teal px-6 py-[13px] text-[12px] font-medium tracking-[0.12em] whitespace-nowrap text-white uppercase transition-colors hover:bg-[#4fa99c] sm:self-auto"
                        >
                          Download PDF
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

/** The downloadable documents of a resource type for a product. */
function documentsFor(type: string, productSlug: string) {
  if (type === "proposal-forms" || type === "renewal-declarations" || type === "claim-forms") {
    return onlineForms
      .filter((f) => (f.resource ?? "proposal-forms") === type && f.productSlugs.includes(productSlug))
      .map((f) => ({ title: f.title, edition: undefined, href: `/downloads/${f.slug}.pdf` }));
  }
  if (type === "product-fact-sheets") {
    const sheet = factSheetFor(productSlug);
    return sheet ? [{ title: sheet.title, edition: sheet.edition, href: sheet.file }] : [];
  }
  if (type === "policy-wording") {
    return wordingsFor(productSlug).map((d) => ({ title: d.title, edition: d.edition, href: d.file }));
  }
  return [];
}
