import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
import { Suspense } from "react";

// Website analytics: Vercel Web Analytics (visitors, where they came from and
// which pages and products they view, without cookies) and Speed Insights.
// Switch both on under the project's Analytics tab in Vercel. Google Analytics
// also loads when NEXT_PUBLIC_GA_ID is set (mention it in the privacy policy).
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export function SiteAnalytics() {
  return (
    <Suspense fallback={null}>
      <Analytics />
      <SpeedInsights />
      {GA_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
          </Script>
        </>
      )}
    </Suspense>
  );
}
