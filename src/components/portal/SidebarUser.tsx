import { requireBroker } from "@/lib/portal/auth";
import { SignOutButton } from "./SignOutButton";

export async function SidebarUser() {
  const user = await requireBroker();
  const initials = user.name
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-site-teal text-[14px] font-semibold text-white">
          {initials}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[14px] font-medium text-charcoal">{user.name}</p>
          <p className="truncate text-[12px] text-body">{user.brokerageName}</p>
        </div>
      </div>
      <div className="mt-4">
        <SignOutButton />
      </div>
    </div>
  );
}

export function SidebarUserFallback() {
  return (
    <div className="flex animate-pulse items-center gap-3">
      <span className="h-10 w-10 rounded-full bg-[#eee]" />
      <span className="h-4 w-32 rounded-sm bg-[#eee]" />
    </div>
  );
}
