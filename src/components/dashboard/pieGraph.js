"use client";
import { useId, useMemo, useRef, useState, useEffect } from "react";
import { Tile, TileHeader, fmt } from "@/components/dashboard/helpers";

// Keep these exactly as they were in your original PieGraph.js

const COLORS = [
  "#2563eb",
  "#0f766e",
  "#7c3aed",
  "#ea580c",
  "#16a34a",
  "#dc2626",
  "#0891b2",
  "#9333ea",
  "#ca8a04",
  "#475569",
];

function polarToCartesian(cx, cy, r, angle) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function createDonutSlicePath(cx, cy, outerR, innerR, startAngle, endAngle) {
  const startOuter = polarToCartesian(cx, cy, outerR, endAngle);
  const endOuter = polarToCartesian(cx, cy, outerR, startAngle);
  const startInner = polarToCartesian(cx, cy, innerR, endAngle);
  const endInner = polarToCartesian(cx, cy, innerR, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    `M ${startOuter.x} ${startOuter.y}`,
    `A ${outerR} ${outerR} 0 ${largeArcFlag} 0 ${endOuter.x} ${endOuter.y}`,
    `L ${endInner.x} ${endInner.y}`,
    `A ${innerR} ${innerR} 0 ${largeArcFlag} 1 ${startInner.x} ${startInner.y}`,
    "Z",
  ].join(" ");
}

export function PieGraph({
  data = {},
  title = "Category Wise Spending",
  subtitle = "expense split",
  className = "",
}) {
  const [activeIndex, setActiveIndex] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [visibleCategories, setVisibleCategories] = useState(null); // null = all
  const dropdownRef = useRef(null);
  const rawId = useId();
  const glowId = `pieGlow-${rawId.replace(/:/g, "")}`;

  // Close dropdown on outside click
  useEffect(() => {
    function handle(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const allChartData = useMemo(() => {
    return Object.entries(data)
      .map(([category, rawValue]) => ({
        category,
        value: Array.isArray(rawValue)
          ? Number(rawValue[0] || 0)
          : Number(rawValue || 0),
      }))
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [data]);

  // Initialize visibleCategories once allChartData is ready
  const allCategories = useMemo(
    () => allChartData.map((d) => d.category),
    [allChartData],
  );
  const selected = visibleCategories ?? allCategories;

  const chartData = useMemo(
    () => allChartData.filter((d) => selected.includes(d.category)),
    [allChartData, selected],
  );

  const total = useMemo(
    () => chartData.reduce((sum, item) => sum + item.value, 0),
    [chartData],
  );

  const slices = useMemo(() => {
    const result = chartData.reduce(
      (acc, item, index) => {
        const percentage = total > 0 ? item.value / total : 0;
        const angle = percentage * 360;
        return {
          currentAngle: acc.currentAngle + angle,
          items: [
            ...acc.items,
            {
              ...item,
              color:
                COLORS[allCategories.indexOf(item.category) % COLORS.length], // stable color by original index
              percentage,
              startAngle: acc.currentAngle,
              endAngle: acc.currentAngle + angle,
            },
          ],
        };
      },
      { currentAngle: 0, items: [] },
    );
    return result.items;
  }, [chartData, total, allCategories]);

  const activeSlice = activeIndex !== null ? slices[activeIndex] : null;

  function toggleCategory(cat) {
    const current = visibleCategories ?? allCategories;
    if (current.includes(cat)) {
      if (current.length === 1) return; // keep at least one
      setVisibleCategories(current.filter((c) => c !== cat));
    } else {
      const next = allCategories.filter((c) => [...current, cat].includes(c)); // preserve order
      setVisibleCategories(next.length === allCategories.length ? null : next);
    }
    setActiveIndex(null);
  }

  function toggleAll() {
    setVisibleCategories(null); // null = all selected
    setActiveIndex(null);
  }

  const isAllSelected = selected.length === allCategories.length;

  const size = 100;
  const cx = 50;
  const cy = 50;
  const outerRadius = 30;
  const innerRadius = 18;

  return (
    <Tile
      hover={false}
      delay={100}
      className={`p-4 flex flex-col ${className}`}
    >
      <TileHeader title={title} subtitle={subtitle} />
      <div className="mt-4 grid gap-6">
        {" "}
        {/* Chart area — unchanged */}
        <div className="relative mx-auto w-full max-w-[260px] flex items-center justify-center">
          {" "}
          {slices.length === 0 ? (
            <div className="w-full h-full max-h-full aspect-square rounded-full border border-dashed border-stone-300 flex items-center justify-center">
              <p className="font-mono text-[11px] uppercase tracking-widest text-stone-400">
                No data
              </p>
            </div>
          ) : (
            <svg
              viewBox={`0 0 ${size} ${size}`}
              preserveAspectRatio="xMidYMid meet"
              className="w-full h-auto aspect-square overflow-visible block"
            >
              <defs>
                <filter
                  id={glowId}
                  x="-40%"
                  y="-40%"
                  width="100%"
                  height="100%"
                >
                  <feGaussianBlur stdDeviation="1.8" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {slices.map((slice, index) => {
                const isActive = activeIndex === index;
                const isDimmed = activeIndex !== null && activeIndex !== index;
                return (
                  <path
                    key={slice.category}
                    d={createDonutSlicePath(
                      cx,
                      cy,
                      isActive ? outerRadius + 2 : outerRadius,
                      innerRadius,
                      slice.startAngle,
                      slice.endAngle,
                    )}
                    fill={slice.color}
                    opacity={isDimmed ? 0.35 : 1}
                    stroke="#ffffff"
                    strokeWidth="1.4"
                    filter={isActive ? `url(#${glowId})` : "none"}
                    className="cursor-pointer transition-all duration-200"
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                  />
                );
              })}
              <circle cx={cx} cy={cy} r={innerRadius - 2} fill="#ffffff" />
              <text
                x={cx}
                y={cy - 3}
                textAnchor="middle"
                className="fill-stone-950 font-mono text-[6px] font-bold"
              >
                {activeSlice
                  ? `${Math.round(activeSlice.percentage * 100)}%`
                  : fmt(total)}
              </text>
              <text
                x={cx}
                y={cy + 5}
                textAnchor="middle"
                className="fill-stone-400 font-mono text-[3.5px] uppercase tracking-widest"
              >
                {activeSlice ? activeSlice.category : "total"}
              </text>
            </svg>
          )}
        </div>
        {/* Legend area */}
        <div className="w-full min-w-0 flex flex-col">
          {" "}
          <div className="flex items-end justify-between border-b border-stone-100 pb-3 mb-3 shrink-0">
            <div>
              <p className="font-mono text-[22px] font-bold text-stone-950 tracking-tight">
                {fmt(total)}
              </p>
              <p className="font-mono text-[9px] uppercase tracking-widest text-stone-400 mt-1">
                total expenses
              </p>
            </div>

            {/* Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-stone-500 hover:border-stone-300 hover:text-stone-800 transition-all"
              >
                {isAllSelected
                  ? "All categories"
                  : `${selected.length} / ${allCategories.length}`}
                <svg
                  className={`w-3 h-3 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                  viewBox="0 0 12 12"
                  fill="none"
                >
                  <path
                    d="M2 4l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-1.5 z-20 w-52 rounded-xl border border-stone-200 bg-white shadow-lg py-1.5 max-h-64 overflow-y-auto">
                  {/* All toggle */}
                  <button
                    type="button"
                    onClick={toggleAll}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-stone-50 transition-colors"
                  >
                    <span
                      className={`h-4 w-4 rounded border flex items-center justify-center shrink-0 transition-colors ${isAllSelected ? "bg-stone-900 border-stone-900" : "border-stone-300"}`}
                    >
                      {isAllSelected && (
                        <svg
                          className="w-2.5 h-2.5 text-white"
                          viewBox="0 0 10 10"
                          fill="none"
                        >
                          <path
                            d="M2 5l2.5 2.5L8 3"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-widest text-stone-700 font-semibold">
                      All
                    </span>
                  </button>

                  <div className="border-t border-stone-100 my-1" />

                  {allChartData.map((item) => {
                    const color =
                      COLORS[
                        allCategories.indexOf(item.category) % COLORS.length
                      ];
                    const isChecked = selected.includes(item.category);
                    return (
                      <button
                        key={item.category}
                        type="button"
                        onClick={() => toggleCategory(item.category)}
                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-stone-50 transition-colors"
                      >
                        <span
                          className={`h-4 w-4 rounded border flex items-center justify-center shrink-0 transition-colors ${isChecked ? "border-transparent" : "border-stone-300 bg-white"}`}
                          style={isChecked ? { backgroundColor: color } : {}}
                        >
                          {isChecked && (
                            <svg
                              className="w-2.5 h-2.5 text-white"
                              viewBox="0 0 10 10"
                              fill="none"
                            >
                              <path
                                d="M2 5l2.5 2.5L8 3"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </span>
                        <span className="truncate font-mono text-[11px] text-stone-700 uppercase tracking-widest">
                          {item.category}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          {/* Legend list — unchanged */}
          <div className="pr-1 space-y-2">
            {" "}
            {slices.map((slice, index) => {
              const isActive = activeIndex === index;
              return (
                <button
                  key={slice.category}
                  type="button"
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                  className={`w-full flex items-center justify-between gap-3 rounded-xl px-3 py-2 transition-all duration-150 text-left ${isActive ? "bg-stone-100" : "hover:bg-stone-50"}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className="h-3 w-3 rounded-full shrink-0"
                      style={{ backgroundColor: slice.color }}
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-stone-800">
                        {slice.category}
                      </p>
                      <p className="font-mono text-[10px] text-stone-400 uppercase tracking-widest">
                        {Math.round(slice.percentage * 100)}% of total
                      </p>
                    </div>
                  </div>
                  <p className="font-mono text-sm font-bold text-stone-900 shrink-0">
                    {fmt(slice.value)}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Tile>
  );
}
