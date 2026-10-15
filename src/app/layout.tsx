import type { Metadata } from "next";
import { Poppins, Raleway } from "next/font/google";
import { seo } from "@/content/seo";
import { site } from "@/content/site";
import { GATE_ON } from "@/lib/gate/config";
import "./globals.css";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: seo.siteTitle,
    template: `%s | ${site.name}`,
  },
  description: seo.siteDescription,
  applicationName: site.name,
  // Kept out of search engines while the Coming Soon page is on; indexed from launch.
  robots: GATE_ON ? { index: false, follow: false } : { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_NZ",
    siteName: site.name,
    title: seo.siteTitle,
    description: seo.siteDescription,
    images: [{ url: seo.shareImage, width: 1600, height: 1067, alt: "Otta, specialist insurance" }],
  },
  twitter: { card: "summary_large_image", title: seo.siteTitle, description: seo.siteDescription, images: [seo.shareImage] },
  alternates: { canonical: "/" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-NZ" className={`${raleway.variable} ${poppins.variable} h-full`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
