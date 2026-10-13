import { Suspense } from "react";
import { PortalShell } from "@/components/portal/PortalShell";
import { SidebarUser, SidebarUserFallback } from "@/components/portal/SidebarUser";
import { site } from "@/content/site";
import { PORTAL_HOST } from "@/lib/portal/config";

// Signed-in area of the portal. Each page checks the session itself inside a
// Suspense boundary (see src/lib/portal/auth.ts).
export default function PortalAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalShell
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
