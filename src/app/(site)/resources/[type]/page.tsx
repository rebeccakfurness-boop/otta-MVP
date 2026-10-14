import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, PageIntro } from "@/components/Mockup";
import { onlineForms } from "@/content/forms";
import { products } from "@/content/products";
import { resourcesNav } from "@/content/site";

const types = resourcesNav.map((r) => ({ type: r.href.split("/").pop()!, label: r.label }));

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
          <p>Download the {entry.label.toLowerCase()} for each Otta product. Documents to come.</p>
        </PageIntro>
        {/* TODO(stage 2): link to real PDFs (Vercel Blob) once documents are supplied. */}
        <ul className="mx-auto mt-[72px] max-w-[1000px] space-y-4">
          {products.map((p) => {
            // Otta-branded proposal forms that already exist (see src/content/forms).
            const form = entry.type === "proposal-forms" ? onlineForms.find((f) => f.productSlugs.includes(p.slug)) : undefined;
            return (
              <li
                key={p.slug}
                id={p.slug}
                className="flex scroll-mt-28 flex-col gap-4 rounded-sm bg-footer px-8 py-6 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-heading text-[20px] font-semibold text-charcoal">
                    <Link href={`/solutions/${p.slug}`} className="hover:text-site-teal">
                      {p.name}
                    </Link>
                  </p>
                  <p className="mt-1 text-[14px] text-body">{form ? form.title : entry.label}</p>
                </div>
                {form ? (
                  <a
                    href={`/downloads/${form.slug}.pdf`}
                    target="_blank"
                    rel="noreferrer"
                    className="self-start bg-site-teal px-6 py-[13px] text-[12px] font-medium tracking-[0.12em] text-white uppercase transition-colors hover:bg-[#4fa99c] sm:self-auto"
                  >
                    Download PDF
                  </a>
                ) : (
                  <span className="self-start bg-[#c9c9c9] px-6 py-[13px] text-[12px] font-medium tracking-[0.12em] text-white uppercase sm:self-auto">
                    Coming soon
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
