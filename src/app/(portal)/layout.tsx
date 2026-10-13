import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Broker Portal | Otta", template: "%s | Otta Broker Portal" },
  description: "Otta's secure portal for brokers: quote requests, policies, documents and forms.",
  robots: { index: false, follow: false },
};

// The broker portal shares the root html/fonts but none of the website chrome.
export default function PortalRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-full flex-1 flex-col bg-footer">{children}</div>;
}
