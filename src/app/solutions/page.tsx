import type { Metadata } from "next";
import Link from "next/link";
import { Container, SquareButton } from "@/components/Mockup";
import { products } from "@/content/products";

export const metadata: Metadata = { title: "Our Solutions" };

export default function SolutionsPage() {
  return (
    <section className="bg-[#85c6bd] pt-[110px] pb-[110px]">
      <Container>
        <h1 className="text-center font-heading text-[30px] font-semibold tracking-normal text-white">
          Otta Specialised Insurance Solutions
        </h1>
        <div className="mx-auto mt-[86px] grid max-w-[1333px] gap-9 md:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <article key={p.slug} className="flex flex-col items-start bg-white p-9">
              <span className="flex h-[82px] w-[82px] items-center justify-center rounded-full border border-site-teal text-site-teal">
                <svg aria-hidden viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="m5 12.5 4.5 4.5L19 7.5" />
                </svg>
              </span>
              <h2 className="mt-5 text-[24px] leading-[1.2] font-semibold tracking-normal text-site-teal">
                <Link href={`/solutions/${p.slug}`} className="hover:text-[#4fa99c]">
                  {p.name}
                </Link>
              </h2>
              <p className="mt-4 text-[15px] leading-[1.9] text-body">{p.overview}</p>
              <div className="mt-6">
                <SquareButton href={`/solutions/${p.slug}`} tone="teal">
                  Find out more
                </SquareButton>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-[90px] text-center">
          <h2 className="mx-auto max-w-[520px] text-[32px] leading-[1.2] font-semibold tracking-normal text-white md:text-[37px]">
            Discover how Otta keeps Company Name moving
          </h2>
          <div className="mt-10">
            <SquareButton href="/about-us/case-studies">Discover our case studies</SquareButton>
          </div>
        </div>
      </Container>
    </section>
  );
}
