import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApplicationForm } from "@/components/forms/ApplicationForm";
import { Container } from "@/components/Mockup";
import { applyCopy } from "@/content/apply";
import { applicationFormFor, onlineForms } from "@/content/forms";
import { getProduct, products } from "@/content/products";
import { submitPublicApplication } from "./actions";

export function generateStaticParams() {
  return products.filter((p) => applicationFormFor(p.slug)).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/solutions/[slug]/apply/online">): Promise<Metadata> {
  const product = getProduct((await params).slug);
  const form = product && applicationFormFor(product.slug);
  return { title: form?.title ?? "Apply" };
}

// The product's proposal form, for people applying directly (no broker).
export default async function OnlineApplicationPage({ params }: PageProps<"/solutions/[slug]/apply/online">) {
  const product = getProduct((await params).slug);
  const form = product && applicationFormFor(product.slug);
  if (!product || !form || !onlineForms.includes(form)) notFound();

  return (
    <section className="bg-footer pt-16 pb-24">
      <Container className="max-w-[1180px]">
        <div className="mb-10">
          <p className="text-[12px] font-medium tracking-[0.14em] text-[#2e7d74] uppercase">{product.name}</p>
          <h1 className="mt-3 text-[32px] leading-tight tracking-[-0.02em] md:text-[40px]">{form.title}</h1>
          <p className="mt-4 max-w-3xl text-[16px] leading-relaxed text-body">{applyCopy.formIntro(form.sendTo)}</p>
        </div>
        <ApplicationForm
          formId={form.id}
          audience="public"
          action={submitPublicApplication.bind(null, form.id)}
          defaults={{}}
          pdfUrl={`/solutions/${product.slug}/apply/online/pdf`}
          addressUrl="/address-search"
        />
      </Container>
    </section>
  );
}
