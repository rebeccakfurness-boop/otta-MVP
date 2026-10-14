import { Suspense } from "react";
import { AdminUser } from "@/components/admin/AdminUser";
import { PortalShell } from "@/components/portal/PortalShell";
import { SidebarUserFallback } from "@/components/portal/SidebarUser";
import { site } from "@/content/site";
import { ADMIN_HOST, adminPath } from "@/lib/admin/config";

// Signed-in area of the admin portal. Each page checks the session itself
// inside a Suspense boundary (see src/lib/admin/auth.ts).
export default function AdminAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalShell
      label="Admin"
      labelClassName="text-site-blue"
      homeHref={adminPath("/")}
      nav={[
        { label: "Overview", href: adminPath("/"), icon: "home" },
        { label: "Policies", href: adminPath("/policies"), icon: "policies" },
        { label: "Quote requests", href: adminPath("/quotes"), icon: "quotes" },
        { label: "Applications", href: adminPath("/applications"), icon: "apply" },
        { label: "Brokers", href: adminPath("/brokers"), icon: "users" },
        { label: "Access requests", href: adminPath("/access-requests"), icon: "plus" },
        { label: "Documents", href: adminPath("/documents"), icon: "documents" },
        { label: "Forms", href: adminPath("/forms"), icon: "forms" },
        { label: "Data sources", href: adminPath("/data-sources"), icon: "sync" },
      ]}
      websiteUrl={ADMIN_HOST ? site.url : "/"}
      user={
        <Suspense fallback={<SidebarUserFallback />}>
          <AdminUser />
        </Suspense>
      }
    >
      {children}
    </PortalShell>
  );
}
