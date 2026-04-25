// components/utils/headerInsights.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "@/components/dashboard/helpers";

export function HeaderInsights({
  DATA = [],
  onInsightClick,
  onRemoveInsight,
  showRemove = true,
}) {
  const router = useRouter();

  const [items, setItems] = useState(DATA);
  const [mounted, setMounted] = useState(false);
  const [removingPage, setRemovingPage] = useState(null);

  useEffect(() => {
    setItems(DATA);
  }, [DATA]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  function handleInsightClick(page) {
    if (onInsightClick) {
      onInsightClick(page);
      return;
    }

    router.push(page);
  }

  function handleRemoveInsight(event, page) {
    event.stopPropagation();

    setRemovingPage(page);

    window.setTimeout(() => {
      setItems((currentItems) =>
        currentItems.filter((item) => item.page !== page),
      );

      setRemovingPage(null);

      if (onRemoveInsight) {
        onRemoveInsight(page);
      }
    }, 180);
  }

  if (!items.length) return null;

  return (
    <nav
      aria-label="Insights navigation"
      className="
        w-full lg:w-auto
        overflow-x-auto scrollbar-none
      "
    >
      <div className="flex items-center gap-2 lg:justify-end">
        {items.map((ins, index) => {
          const isRemoving = removingPage === ins.page;

          return (
            <button
              key={ins.page}
              type="button"
              onClick={() => handleInsightClick(ins.page)}
              style={{
                transitionDelay:
                  mounted && !isRemoving ? `${index * 45}ms` : "0ms",
              }}
              className={`
                group shrink-0
                inline-flex items-center gap-2
                rounded-full border border-stone-200 bg-white/80
                px-3.5 py-2
                shadow-sm backdrop-blur
                transition-all duration-200 ease-out
                hover:bg-stone-950 hover:border-stone-950 hover:shadow-md
                ${
                  mounted && !isRemoving
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 -translate-y-1 scale-95"
                }
              `}
            >
              {ins.icon && (
                <span className="text-sm leading-none transition-transform duration-200 group-hover:scale-110">
                  {ins.icon}
                </span>
              )}

              <span
                className="
                  max-w-30 truncate
                  font-mono text-[11px] font-semibold uppercase tracking-wider
                  text-stone-600 transition-colors duration-200
                  group-hover:text-amber-50
                "
              >
                {ins.navTitle || ins.title}
              </span>

              <ChevronRight
                className="
                  h-3.5 w-3.5 text-stone-400
                  transition-all duration-200
                  group-hover:translate-x-0.5 group-hover:text-amber-100
                "
              />

              {showRemove && (
                <span
                  role="button"
                  tabIndex={0}
                  aria-label={`Remove ${ins.title}`}
                  onClick={(event) => handleRemoveInsight(event, ins.page)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      handleRemoveInsight(event, ins.page);
                    }
                  }}
                  className="
                    ml-1 flex h-5 w-5 items-center justify-center
                    rounded-full text-[10px] text-stone-400
                    transition-all duration-150
                    hover:bg-stone-200 hover:text-stone-900
                    group-hover:hover:bg-stone-800 group-hover:hover:text-amber-50
                  "
                >
                  ×
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
