import { Suspense } from "react";
import { PortalShell } from "@/components/portal/PortalShell";
import { SidebarUser, SidebarUserFallback } from "@/components/portal/SidebarUser";
import { site } from "@/content/site";
import { PORTAL_HOST, portalPath } from "@/lib/portal/config";

// Signed-in area of the portal. Each page checks the session itself inside a
// Suspense boundary (see src/lib/portal/auth.ts).
export default function PortalAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalShell
      label="Broker Portal"
      homeHref={portalPath("/")}
      nav={[
        { label: "Dashboard", href: portalPath("/"), icon: "home" },
        { label: "Forms", href: portalPath("/forms"), icon: "forms" },
        { label: "Quote requests", href: portalPath("/quotes"), icon: "quotes" },
        { label: "Policies", href: portalPath("/policies"), icon: "policies" },
        { label: "Documents", href: portalPath("/documents"), icon: "documents" },
        { label: "Help & contact", href: portalPath("/help"), icon: "help" },
      ]}
      websiteUrl={PORTAL_HOST ? site.url : "/"}
      user={
        <Suspense fallback={<SidebarUserFallback />}>
          <SidebarUser />
        </Suspense>
      }
    >
      {children}
    </PortalShell>
  );
}
