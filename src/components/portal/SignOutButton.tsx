"use client";

import { useTransition } from "react";
import { logout } from "@/app/(portal)/portal/login/actions";
import { portalPath } from "@/lib/portal/config";
import { Icon } from "./Icon";

export function SignOutButton() {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        start(async () => {
          await logout();
          window.location.assign(portalPath("/login"));
        })
      }
      className="inline-flex items-center gap-1.5 text-[13px] text-charcoal hover:text-site-teal disabled:opacity-60"
    >
      <Icon name="logout" className="h-4 w-4" />
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}
