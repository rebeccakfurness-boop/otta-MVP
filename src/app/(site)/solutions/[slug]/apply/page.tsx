import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, PageIntro } from "@/components/Mockup";
import { applyCopy } from "@/content/apply";
import { applicationFormFor, proposalFormsFor } from "@/content/forms";
import { getProduct, products } from "@/content/products";
import { portalUrl } from "@/lib/portal/config";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/solutions/[slug]/apply">): Promise<Metadata> {
  const product = getProduct((await params).slug);
  return { title: product ? applyCopy.title(product.name) : "Apply" };
}

// "Apply now": brokers apply through the portal; anyone can download the blank form.
export default async function ApplyPage({ params }: PageProps<"/solutions/[slug]/apply">) {
  const product = getProduct((await params).slug);
  if (!product) notFound();
  const form = applicationFormFor(product.slug);
  const downloads = proposalFormsFor(product.slug);
  const brokerHref = portalUrl(form ? `/forms/${form.slug}` : "/");

  return (
    <section className="pt-[118px] pb-[120px]">
      <Container className="max-w-[1000px]">
        <PageIntro title={applyCopy.title(product.name)}>
          <p>{applyCopy.intro}</p>
        </PageIntro>
        <div className="mt-[72px] grid gap-6 md:grid-cols-2">
          <Choice
            heading={applyCopy.broker.heading}
            body={applyCopy.broker.body}
            button={applyCopy.broker.button}
            href={brokerHref}
            external
            tone="blue"
          />
          {downloads.length > 1 ? (
            <div className="flex h-full flex-col bg-site-teal p-9 text-white">
              <h2 className="text-[26px] font-bold tracking-[-0.01em] text-white">{applyCopy.download.heading}s</h2>
              <p className="mt-4 text-[16px] leading-relaxed text-white/90">{applyCopy.download.bodyMany}</p>
              <ul className="mt-6 space-y-2">
                {downloads.map((f) => (
                  <li key={f.id}>
                    <a
                      href={`/downloads/${f.slug}.pdf`}
                      target="_blank"
                      rel="noopener"
                      className="group flex items-center justify-between gap-3 bg-white px-5 py-3 text-[14px] font-medium text-charcoal transition-colors hover:bg-[#f1f8f7]"
                    >
                      {f.title}
                      <span className="shrink-0 text-[11px] tracking-[0.12em] text-[#2e7d74] uppercase">PDF</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : form ? (
            <Choice
              heading={applyCopy.download.heading}
              body={applyCopy.download.body(form.title)}
              button={applyCopy.download.button}
              href={`/downloads/${form.slug}.pdf`}
              external
              newTab
              tone="teal"
            />
          ) : (
            <Choice
              heading={applyCopy.noForm.heading}
              body={applyCopy.noForm.body}
              button={applyCopy.noForm.button}
              href={`/contact?product=${product.slug}`}
              tone="teal"
            />
          )}
        </div>
      </Container>
    </section>
  );
}

function Choice(props: { heading: string; body: string; button: string; href: string; external?: boolean; newTab?: boolean; tone: "teal" | "blue" }) {
  const className = `group flex h-full flex-col p-9 text-white transition-colors ${
    props.tone === "teal" ? "bg-site-teal hover:bg-[#4fa99c]" : "bg-site-blue hover:bg-[#013a50]"
  }`;
  const content = (
    <>
      <h2 className="text-[26px] font-bold tracking-[-0.01em] text-white">{props.heading}</h2>
      <p className="mt-4 flex-1 text-[16px] leading-relaxed text-white/90">{props.body}</p>
      <span className="mt-8 inline-flex items-center gap-2 self-start bg-white px-6 py-[13px] text-[12px] font-medium tracking-[0.12em] text-charcoal uppercase">
        {props.button}
        <svg aria-hidden viewBox="0 0 16 16" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M1.5 8h12M9 3.5 13.5 8 9 12.5" />
        </svg>
      </span>
    </>
  );
  // The portal can be on its own subdomain, and the PDF is a file, so both are plain links.
  return props.external ? (
    <a href={props.href} className={className} {...(props.newTab ? { target: "_blank", rel: "noopener" } : {})}>
      {content}
    </a>
  ) : (
    <Link href={props.href} className={className}>
      {content}
    </Link>
  );
}
