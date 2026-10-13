import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Admin | Otta", template: "%s | Otta Admin" },
  robots: { index: false, follow: false },
};

// Otta staff admin portal. Shares the root html/fonts but none of the website chrome.
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-full flex-1 flex-col bg-footer">{children}</div>;
}
