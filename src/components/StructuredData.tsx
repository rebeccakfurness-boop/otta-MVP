import { products } from "@/content/products";
import { site } from "@/content/site";

// Structured data so search engines understand who Otta is and what it offers.
const organisation = {
  "@context": "https://schema.org",
  "@type": "InsuranceAgency",
  name: site.name,
  url: site.url,
  logo: `${site.url}/brand/otta-logo.png`,
  description: site.description,
  telephone: site.phone,
  email: site.email,
  areaServed: { "@type": "Country", name: "New Zealand" },
  address: {
    "@type": "PostalAddress",
    streetAddress: `${site.address[0]}, ${site.address[1]}`,
    addressLocality: "Auckland",
    postalCode: "1026",
    addressCountry: "NZ",
  },
  makesOffer: products.map((p) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: p.name, url: `${site.url}/solutions/${p.slug}` } })),
};

export function OrganisationData() {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organisation) }} />;
}

/** An insurance product, with breadcrumbs, for its product page. */
export function ProductData({ slug, name, description, underwriter }: { slug: string; name: string; description: string; underwriter?: string }) {
  const url = `${site.url}/solutions/${slug}`;
  const data = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      serviceType: "Insurance",
      name,
      description,
      url,
      areaServed: { "@type": "Country", name: "New Zealand" },
      provider: { "@type": "InsuranceAgency", name: site.name, url: site.url },
      ...(underwriter ? { brand: { "@type": "Organization", name: underwriter } } : {}),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: site.url },
        { "@type": "ListItem", position: 2, name: "Solutions", item: `${site.url}/solutions` },
        { "@type": "ListItem", position: 3, name, item: url },
      ],
    },
  ];
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
