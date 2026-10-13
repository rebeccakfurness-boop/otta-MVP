"use client";

import { useId, useState, type ReactNode } from "react";

export function Tabs({ tabs }: { tabs: { label: string; content: ReactNode }[] }) {
  const [active, setActive] = useState(0);
  const id = useId();
  return (
    <div>
      <div role="tablist" className="flex flex-wrap justify-center border-b border-[#eaeaea]">
        {tabs.map((t, i) => (
          <button
            key={t.label}
            type="button"
            role="tab"
            id={`${id}-tab-${i}`}
            aria-selected={active === i}
            aria-controls={`${id}-panel-${i}`}
            onClick={() => setActive(i)}
            className={`-mb-px border-b-2 px-[23px] pt-2 pb-5 text-[12px] font-semibold tracking-[0.15em] uppercase transition-colors ${
              active === i
                ? "border-site-teal text-site-teal"
                : "border-transparent text-charcoal hover:text-site-teal"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t, i) => (
        <div
          key={t.label}
          role="tabpanel"
          id={`${id}-panel-${i}`}
          aria-labelledby={`${id}-tab-${i}`}
          hidden={active !== i}
          className="pt-11"
        >
          {t.content}
        </div>
      ))}
    </div>
  );
}
