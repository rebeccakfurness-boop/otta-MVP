import type { MetadataRoute } from "next";
import { products } from "@/content/products";
import { resourcesNav, site } from "@/content/site";

// Every public page, for search engines. Product pages rank highest.
export default function sitemap(): MetadataRoute.Sitemap {
  const page = (path: string, priority: number, changeFrequency: "weekly" | "monthly" | "yearly" = "monthly") => ({
    url: `${site.url}${path}`,
    changeFrequency,
    priority,
  });
  return [
    page("", 1, "weekly"),
    page("/solutions", 0.9),
    ...products.map((p) => page(`/solutions/${p.slug}`, 0.9)),
    page("/claims", 0.8),
    page("/resources", 0.7),
    ...resourcesNav.map((r) => page(r.href, r.href.endsWith("faqs") ? 0.8 : 0.6)),
    page("/contact", 0.7),
    page("/about-us", 0.6),
    page("/about-us/our-team", 0.5),
    page("/about-us/partners", 0.4),
    page("/about-us/case-studies", 0.5),
    page("/complaints", 0.3, "yearly"),
    page("/fair-insurance-code", 0.3, "yearly"),
  ];
}
