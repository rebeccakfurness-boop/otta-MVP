import { adminLogout } from "@/app/(admin)/admin/login/actions";
import { SignOutButton } from "@/components/portal/SignOutButton";
import { requireAdmin } from "@/lib/admin/auth";
import { adminPath } from "@/lib/admin/config";

export async function AdminUser() {
  const user = await requireAdmin();
  const initials = user.name
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-site-blue text-[14px] font-semibold text-white">{initials}</span>
        <div className="min-w-0">
          <p className="truncate text-[14px] font-medium text-charcoal">{user.name}</p>
          <p className="truncate text-[12px] text-body">Otta · {user.role}</p>
        </div>
      </div>
      <div className="mt-4">
        <SignOutButton action={adminLogout} redirectTo={adminPath("/login")} />
      </div>
    </div>
  );
}
