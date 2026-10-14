"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { setHandled } from "./actions";

export function HandledButton({
  id,
  handled,
}: {
  id: string;
  handled: boolean;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        start(async () => {
          await setHandled(id, !handled);
          router.refresh();
        })
      }
      className={`px-3 py-1.5 text-[11px] font-medium tracking-[0.1em] uppercase transition-colors disabled:opacity-60 ${
        handled
          ? "border border-[#d6d6d6] bg-white text-body hover:border-site-teal hover:text-site-teal"
          : "bg-site-teal text-white hover:bg-[#4fa99c]"
      }`}
    >
      {pending ? "Saving" : handled ? "Reopen" : "Mark handled"}
    </button>
  );
}
