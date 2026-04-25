"use client";

import { useEffect, useState } from "react";
import { HeaderInsights } from "@/components/utils/headerInsights";
import { insights } from "@/lib/globalHelpers";

export function Header({ pageName, user }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const h = now.getHours();

  const greeting =
    h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";

  return (
    <header className="pb-5 border-stone-300/50 opacity-0 animate-[fadeSlideIn_0.5s_ease_forwards]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-baseline">
            <h1
              className="text-[clamp(2rem,4vw,3rem)] font-light leading-none tracking-tight text-stone-900"
              style={{ fontFamily: "Arial, sans-serif" }}
            >
              Spendwise
            </h1>
          </div>

          {pageName && (
            <p className="font-mono text-[11px] font-medium tracking-widest uppercase text-stone-500 mt-1.5">
              {pageName}
            </p>
          )}
        </div>

        <HeaderInsights DATA={insights} />
      </div>
    </header>
  );
}
