import { Suspense } from "react";
import { PortalShell } from "@/components/portal/PortalShell";
import { SidebarUser, SidebarUserFallback } from "@/components/portal/SidebarUser";
import { site } from "@/content/site";
import { readBroker } from "@/lib/portal/auth";
import { PORTAL_HOST, portalPath } from "@/lib/portal/config";
import { brokerOnlyPaths, canPlace } from "@/lib/portal/scope";

/** Networks and coverholders don't place business, so their menu leaves those pages out. */
async function hiddenNavPaths() {
  const broker = await readBroker();
  return broker && canPlace(broker.scope) ? [] : brokerOnlyPaths.map((p) => portalPath(p));
}

// Signed-in area of the portal. Each page checks the session itself inside a
// Suspense boundary (see src/lib/portal/auth.ts).
export default function PortalAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalShell
      label="Broker Portal"
      homeHref={portalPath("/")}
      nav={[
        { label: "Dashboard", href: portalPath("/"), icon: "home" },
        { label: "Applications", href: portalPath("/applications"), icon: "apply", restricted: true },
        { label: "Forms", href: portalPath("/forms"), icon: "forms", restricted: true },
        { label: "Quote requests", href: portalPath("/quotes"), icon: "quotes" },
        { label: "Policies", href: portalPath("/policies"), icon: "policies" },
        { label: "Claims", href: portalPath("/claims"), icon: "claim" },
        { label: "Documents", href: portalPath("/documents"), icon: "documents" },
        { label: "Policy wordings", href: portalPath("/wordings"), icon: "book" },
        { label: "Training", href: portalPath("/training"), icon: "training", restricted: true },
        { label: "Help & contact", href: portalPath("/help"), icon: "help" },
        { label: "Your account", href: portalPath("/account"), icon: "users" },
      ]}
      hiddenPaths={hiddenNavPaths()}
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
