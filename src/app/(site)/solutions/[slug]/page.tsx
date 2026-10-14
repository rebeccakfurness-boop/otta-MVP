import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, SquareButton } from "@/components/Mockup";
import { Tabs } from "@/components/Tabs";
import { factSheetFor, wordingsFor } from "@/content/documents";
import { importantInformation } from "@/content/legal";
import { getProduct, products } from "@/content/products";
import { site } from "@/content/site";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/solutions/[slug]">): Promise<Metadata> {
  const product = getProduct((await params).slug);
  return product ? { title: product.name, description: product.summary } : {};
}

const smallButton =
  "inline-flex items-center px-8 py-[15px] text-[12px] font-medium tracking-[0.12em] text-white uppercase transition-colors";

function Check({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

export default async function ProductPage({ params }: PageProps<"/solutions/[slug]">) {
  const product = getProduct((await params).slug);
  if (!product) notFound();
  // A single wording opens straight away; products with several list them on the Resources page.
  const wordings = wordingsFor(product.slug);
  const policyWording = wordings.length === 1 ? wordings[0].file : `/resources/policy-wording#${product.slug}`;
  const factSheet = factSheetFor(product.slug);

  return (
    <>
      {/* Split hero: image left, introduction right */}
      <section className="grid lg:min-h-[710px] lg:grid-cols-[46%_1fr]">
        <div className="relative min-h-[320px] lg:min-h-full">
          <Image
            src={product.image.src}
            alt={product.image.alt}
            fill
            priority
            sizes="(min-width: 1024px) 46vw, 100vw"
            className="object-cover"
            style={{ objectPosition: product.image.position }}
          />
        </div>
        <div className="flex items-center px-5 py-16 lg:pr-[46px] lg:pl-[145px]">
          <div>
            <h1 className="text-[32px] leading-[1.2] font-bold tracking-normal text-charcoal md:text-[38px]">
              {product.name}
            </h1>
            <div className="mt-10 text-[16px] leading-[1.75] text-body">
              {product.intro.map((para) =>
                Array.isArray(para) ? (
                  <ul key={para[0]} className="list-disc pl-5">
                    {para.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p key={para.slice(0, 32)}>{para}</p>
                ),
              )}
            </div>
            <div className="mt-10 flex flex-wrap gap-[18px]">
              <Link href={`/solutions/${product.slug}/apply`} className={`${smallButton} bg-site-teal hover:bg-[#4fa99c]`}>
                Apply now
              </Link>
              <a href={policyWording} target="_blank" rel="noopener" className={`${smallButton} bg-[#777] hover:bg-charcoal`}>
                View policy documents
              </a>
              <a href={factSheet?.file ?? `/resources/product-fact-sheets#${product.slug}`} target="_blank" rel="noopener" className={`${smallButton} bg-[#777] hover:bg-charcoal`}>
                Download fact sheet
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* At a glance */}
      <section className="bg-[#e6f4f2] pt-10 pb-14">
        <Container>
          <h2 className="text-center text-[28px] font-semibold tracking-normal text-site-teal">
            This policy at a glance
          </h2>
          <div className="mx-auto mt-9 w-full max-w-[400px] border-t border-dotted border-site-teal" />
          <dl className="mt-10 grid gap-8 text-center text-[16px] leading-[1.75] sm:grid-cols-2 lg:grid-cols-4">
            {product.atAGlance
              .filter((row) => row.label !== "Other")
              .map((row) => (
                <div key={row.label} className="px-2">
                  <dt className="font-semibold text-charcoal">{row.label}:</dt>
                  <dd className="text-body">
                    {row.value}
                    {row.label === "Product" && (
                      <>
                        {" "}
                        (
                        <a href={policyWording} target="_blank" rel="noopener" className="hover:text-site-teal">
                          click here for Policy Wording
                        </a>
                        )
                      </>
                    )}
                  </dd>
                </div>
              ))}
          </dl>
          {product.atAGlance.some((row) => row.label === "Other") && (
            <p className="mt-8 text-center text-[16px] text-body">
              <span className="font-semibold text-charcoal">Other: </span>
              {product.atAGlance.find((row) => row.label === "Other")!.value}
            </p>
          )}
        </Container>
      </section>

      {/* Why choose Otta */}
      <section className="bg-[#85c6bd] pt-[62px]">
        <Container>
          <h2 className="text-center text-[28px] font-semibold tracking-normal text-white">
            Why choose Otta for {product.shortName}
          </h2>
          <div className="mt-[72px] grid gap-9 md:grid-cols-3">
            {product.statements.map((statement, i) => (
              <article key={statement} className="bg-white p-9">
                <span className="flex h-[82px] w-[82px] items-center justify-center rounded-full border border-site-teal text-site-teal">
                  <Check className="h-7 w-7" />
                </span>
                <h3 className="mt-[18px] text-[20px] leading-[1.2] font-semibold tracking-normal text-site-teal">
                  {statement}
                </h3>
                <p className="mt-6 text-[16px] leading-[1.75] text-body">{product.statementDetails[i]}</p>
              </article>
            ))}
          </div>
          <div className="pt-[78px] pb-[68px] text-center">
            <h2 className="mx-auto max-w-[520px] text-[32px] leading-[1.3] font-semibold tracking-normal text-white md:text-[37px]">
              Discover how Otta keeps Company Name moving
            </h2>
            <div className="mt-10">
              <SquareButton href="/about-us/case-studies">Discover our case studies</SquareButton>
            </div>
          </div>
        </Container>
        {/* Angled divider into the next section */}
        <svg aria-hidden viewBox="0 0 1488 110" preserveAspectRatio="none" className="block h-[60px] w-full bg-white md:h-[110px]">
          <polygon points="0,0 1488,0 1488,18 310,110 0,110" fill="#c8e5e2" />
          <polygon points="0,0 1488,0 1488,8 0,64" fill="#add9d3" />
        </svg>
      </section>

      {/* Coverage summary */}
      <section className="bg-white pt-[30px] pb-[70px]">
        <Container>
          <p className="font-heading text-[25px] font-light text-site-teal">
            {product.name} Coverage Summary
          </p>
          <h2 className="mt-10 max-w-[680px] text-[32px] leading-[1.15] font-bold tracking-normal text-charcoal md:text-[38px]">
            {product.coverageTagline}
          </h2>
          <hr className="mt-9 border-[#c6c5c0]" />
          <div className="mt-11 grid gap-x-9 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {product.coverage.map((group) => (
              <div key={group.title}>
                <h3 className="text-[20px] font-semibold tracking-normal text-site-teal">{group.title}</h3>
                <ul className="mt-9 text-[16px] leading-[1.75] text-body">
                  {group.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <Check className="mt-[5px] h-4 w-4 shrink-0 text-site-teal" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Important information */}
      <section className="bg-footer pt-[70px] pb-[110px]">
        <Container>
          <h2 className="text-center text-[25px] font-bold tracking-normal text-charcoal">
            Important information about this policy
          </h2>
          <div className="mt-[62px]">
            <Tabs
              tabs={[
                {
                  label: "Important Information",
                  content: (
                    <dl className="grid gap-x-[68px] gap-y-6 text-[14px] leading-[1.6] md:grid-cols-3">
                      {importantInformation.map((item) => (
                        <div key={item.title}>
                          <dt className="font-semibold text-charcoal">{item.title}:</dt>
                          <dd className="mt-4 text-body">{item.body}</dd>
                        </div>
                      ))}
                    </dl>
                  ),
                },
                {
                  label: "Key Exclusions",
                  content: (
                    <ol className="list-decimal space-y-2 pl-5 text-[14px] leading-[1.6] text-body">
                      {product.keyExclusions.map((e) => (
                        <li key={e}>{e}</li>
                      ))}
                    </ol>
                  ),
                },
                {
                  label: "How to Make a Claim",
                  content: (
                    <div className="max-w-[860px] space-y-4 text-[14px] leading-[1.6] text-body">
                      {product.claim.paragraphs.map((para) => (
                        <p key={para.slice(0, 32)}>{para}</p>
                      ))}
                      {product.claim.showContactOptions && (
                        <ul className="list-disc space-y-1 pl-5">
                          <li>
                            Complete the claim form:{" "}
                            <Link href="/resources/claim-forms" className="text-charcoal underline hover:text-site-teal">
                              click here
                            </Link>
                          </li>
                          <li>Call us on {site.claimsPhone}</li>
                          <li>
                            Email us on{" "}
                            <a href={`mailto:${site.claimsEmail}`} className="text-charcoal underline hover:text-site-teal">
                              {site.claimsEmail}
                            </a>
                          </li>
                        </ul>
                      )}
                      {product.claim.emergencyPhone && (
                        <p>
                          <span className="font-semibold text-charcoal">In an emergency call </span>
                          <a href={`tel:${product.claim.emergencyPhone.replace(/\s/g, "")}`} className="font-semibold text-charcoal">
                            {product.claim.emergencyPhone}
                          </a>
                        </p>
                      )}
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </Container>
      </section>

      {/* Claims band */}
      <section className="bg-[#67b8ae] py-[84px] text-center">
        <Container>
          <h2 className="text-[30px] font-bold tracking-normal text-white">Need to make a claim?</h2>
          <p className="mt-8 text-[18px] text-white">To learn how best to make a claim, visit our claims page.</p>
          <div className="mt-10">
            <SquareButton href="/claims">Make a claim</SquareButton>
          </div>
        </Container>
      </section>
    </>
  );
}
