import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { GATE_ON } from "@/lib/gate/config";

// Until launch (Coming Soon page on) nothing is indexed. After launch the
// public website is, but never the portals or client form links.
export default function robots(): MetadataRoute.Robots {
  if (GATE_ON) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/portal", "/admin", "/apply/", "/api/", "/coming-soon"] },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
