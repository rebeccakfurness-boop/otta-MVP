"use client";

import { useTransition } from "react";
import { Icon } from "./Icon";

export function SignOutButton({ action, redirectTo }: { action: () => Promise<void>; redirectTo: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        start(async () => {
          await action();
          window.location.assign(redirectTo);
        })
      }
      className="inline-flex items-center gap-1.5 text-[13px] text-charcoal hover:text-site-teal disabled:opacity-60"
    >
      <Icon name="logout" className="h-4 w-4" />
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}
