import { BackToTop } from "@/components/BackToTop";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SiteAnalytics } from "@/components/SiteAnalytics";
import { SteveChat } from "@/components/SteveChat";
import { OrganisationData } from "@/components/StructuredData";

// Public website chrome. The broker portal (app/(portal)) has its own layout.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <BackToTop />
      <SteveChat />
      <OrganisationData />
      <SiteAnalytics />
    </>
  );
}
