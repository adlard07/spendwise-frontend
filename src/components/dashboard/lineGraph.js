"use client";

import { useMemo, useState, useEffect } from "react";
import { Tile, fmt, TileHeader } from "@/components/dashboard/helpers";
import { RANGES } from "@/app/dashboard/helpers";

export function LineGraph({ data }) {
  const [range, setRange] = useState("ALL");
  const [animKey, setAnimKey] = useState(0);
  // const [dims, setDims] = useState({ width: 680, height: 300 });

  const chartData = data?.chart?.[range] ?? [];

  const total = useMemo(
    () => chartData.reduce((sum, item) => sum + Number(item.v || 0), 0),
    [chartData],
  );

  const max = useMemo(
    () =>
      chartData.length
        ? Math.max(...chartData.map((item) => Number(item.v || 0)))
        : 0,
    [chartData],
  );

  const avg = chartData.length ? total / chartData.length : 0;
  const safeMax = Math.max(max, 1);

  const width = 680;
  const height = 300;

  const padding = {
    top: 36,
    right: 28,
    bottom: 48,
    left: 62,
  };

  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;
  const bottomY = padding.top + innerHeight;

  const points = chartData.map((item, index) => {
    const x =
      chartData.length === 1
        ? padding.left + innerWidth / 2
        : padding.left + (index / (chartData.length - 1)) * innerWidth;

    const y = padding.top + (1 - Number(item.v || 0) / safeMax) * innerHeight;

    return {
      ...item,
      x,
      y,
      value: Number(item.v || 0),
      index,
    };
  });

  const linePoints = points.map((point) => `${point.x},${point.y}`).join(" ");

  const areaPoints =
    points.length > 0
      ? `${points[0].x},${bottomY} ${linePoints} ${
          points[points.length - 1].x
        },${bottomY}`
      : "";

  const avgY = padding.top + (1 - avg / safeMax) * innerHeight;

  const yTicks = [1, 0.75, 0.5, 0.25, 0];

  const labelStep = Math.max(1, Math.ceil(chartData.length / 10));

  return (
    <div className="w-full">
      <Tile
        hover={false}
        delay={100}
        className="p-6 flex flex-col overflow-hidden"
      >
        <TileHeader title="Spendings" />

        {/* Header */}
        <div>
          <div className="mt-4 flex flex-wrap items-start justify-between gap-4 mb-5 pb-4 border-b border-stone-100 shrink-0">
            <div>
              <p className="font-mono text-[22px] font-bold text-stone-950 mt-1 tracking-tight">
                {fmt(total)}
              </p>
              <p className="font-mono text-[9px] text-stone-400 mt-1 tracking-widest uppercase">
                total spend · {range}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 text-right">
              <div>
                <p className="font-mono text-[13px] font-bold text-stone-900">
                  {fmt(max)}
                </p>
                <p className="font-mono text-[9px] text-stone-400 tracking-widest uppercase">
                  peak
                </p>
              </div>

              <div>
                <p className="font-mono text-[13px] font-bold text-stone-900">
                  {fmt(Math.round(avg))}
                </p>
                <p className="font-mono text-[9px] text-stone-400 tracking-widest uppercase">
                  average
                </p>
              </div>
            </div>
          </div>
          <div className="flex shrink-0 gap-2 pt-8 justify-end">
            {RANGES.map((r) => (
              <button
                key={r}
                onClick={() => {
                  setRange(r);
                  setAnimKey((key) => key + 1);
                }}
                className={`
                  h-full px-3 py-2 rounded-xl font-mono text-[11px] font-bold tracking-wider uppercase
                  transition-all duration-200 border
                  ${
                    range === r
                      ? "bg-stone-950 text-blue-100 border-stone-950 shadow-sm shadow-blue-200/60"
                      : "bg-white text-stone-400 border-stone-200 hover:text-stone-800 hover:border-stone-300 hover:bg-stone-50"
                  }
                `}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          {" "}
          {/* Chart */}
          <div className="relative w-full min-w-0 flex flex-col">
            {" "}
            {/* Legends */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2 shrink-0">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.65)]" />
                  <span className="font-mono text-[10px] text-stone-500 uppercase tracking-widest">
                    Spend
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-6 border-t border-dashed border-stone-500" />
                  <span className="font-mono text-[10px] text-stone-500 uppercase tracking-widest">
                    Average
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-6 border-t border-dotted border-gray-300" />
                  <span className="font-mono text-[10px] text-stone-500 uppercase tracking-widest">
                    Grid
                  </span>
                </div>
              </div>

              <p className="font-mono text-[10px] text-stone-400 uppercase tracking-widest">
                {chartData.length} points
              </p>
            </div>
            <div className="relative w-full rounded-2xl border border-stone-100 bg-white/70 overflow-hidden">
              {" "}
              {chartData.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <p className="font-mono text-[11px] text-stone-400 uppercase tracking-widest">
                    No spending data
                  </p>
                </div>
              ) : (
                <svg
                  key={animKey}
                  viewBox={`0 0 ${width} ${height}`}
                  className="w-full h-auto block"
                >
                  <defs>
                    <linearGradient id="spendArea" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="#60a5fa"
                        stopOpacity="0.22"
                      />
                      <stop
                        offset="70%"
                        stopColor="#60a5fa"
                        stopOpacity="0.06"
                      />
                      <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
                    </linearGradient>

                    <filter
                      id="blueGlow"
                      x="-40%"
                      y="-40%"
                      width="180%"
                      height="180%"
                    >
                      <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Horizontal gray-300 dotted grid lines */}
                  {yTicks.map((tick) => {
                    const y = padding.top + (1 - tick) * innerHeight;
                    const value = Math.round(max * tick);

                    return (
                      <g key={tick}>
                        <text
                          x={padding.left - 14}
                          y={y + 4}
                          textAnchor="end"
                          className="fill-stone-400 font-mono text-[10px]"
                        >
                          {fmt(value)}
                        </text>

                        <line
                          x1={padding.left}
                          y1={y}
                          x2={width - padding.right}
                          y2={y}
                          stroke="#d1d5db"
                          strokeWidth="1"
                          strokeDasharray="2 7"
                        />
                      </g>
                    );
                  })}

                  {/* Average line */}
                  <line
                    x1={padding.left}
                    y1={avgY}
                    x2={width - padding.right}
                    y2={avgY}
                    stroke="#57534e"
                    strokeWidth="1"
                    strokeDasharray="6 6"
                    opacity="0.7"
                  />

                  <text
                    x={width - padding.right}
                    y={avgY - 8}
                    textAnchor="end"
                    className="fill-stone-500 font-mono text-[10px]"
                  >
                    avg {fmt(Math.round(avg))}
                  </text>

                  {/* Soft blue area */}
                  {points.length > 1 && (
                    <polygon points={areaPoints} fill="url(#spendArea)">
                      <animate
                        attributeName="opacity"
                        from="0"
                        to="1"
                        dur="500ms"
                        fill="freeze"
                      />
                    </polygon>
                  )}

                  {/* Blue glow line */}
                  {points.length > 1 && (
                    <polyline
                      points={linePoints}
                      fill="none"
                      stroke="#93c5fd"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.5"
                      filter="url(#blueGlow)"
                      pathLength="1"
                      strokeDasharray="1"
                      strokeDashoffset="1"
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        from="1"
                        to="0"
                        dur="700ms"
                        fill="freeze"
                      />
                    </polyline>
                  )}

                  {/* Main line */}
                  {points.length > 1 && (
                    <polyline
                      points={linePoints}
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      pathLength="1"
                      strokeDasharray="1"
                      strokeDashoffset="1"
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        from="1"
                        to="0"
                        dur="700ms"
                        fill="freeze"
                      />
                    </polyline>
                  )}

                  {/* Points, labels, x-axis labels */}
                  {points.map((point, index) => {
                    const isPeak = point.value === max && max > 0;
                    const showValue =
                      chartData.length <= 12 ||
                      isPeak ||
                      index === points.length - 1;

                    const textAnchor =
                      index === 0
                        ? "start"
                        : index === points.length - 1
                          ? "end"
                          : "middle";

                    const shouldShowXLabel =
                      index % labelStep === 0 || index === points.length - 1;

                    return (
                      <g key={`${point.l}-${index}`}>
                        <title>
                          {point.l}: {fmt(point.value)}
                        </title>

                        {/* Blue light around value marker */}
                        <circle
                          cx={point.x}
                          cy={point.y}
                          r={isPeak ? 11 : 9}
                          fill="#bfdbfe"
                          opacity="0.6"
                        >
                          <animate
                            attributeName="r"
                            from="0"
                            to={isPeak ? "11" : "9"}
                            dur="450ms"
                            begin={`${index * 45}ms`}
                            fill="freeze"
                          />
                        </circle>

                        <circle
                          cx={point.x}
                          cy={point.y}
                          r={isPeak ? 5 : 4}
                          fill={isPeak ? "#1e3a8a" : "#2563eb"}
                          stroke="#ffffff"
                          strokeWidth="2"
                        >
                          <animate
                            attributeName="opacity"
                            from="0"
                            to="1"
                            dur="300ms"
                            begin={`${index * 45}ms`}
                            fill="freeze"
                          />
                        </circle>

                        {showValue && (
                          <text
                            x={point.x}
                            y={Math.max(14, point.y - 14)}
                            textAnchor={textAnchor}
                            className="fill-blue-700 font-mono text-[10px] font-bold"
                          >
                            {fmt(point.value)}
                            <animate
                              attributeName="opacity"
                              from="0"
                              to="1"
                              dur="350ms"
                              begin={`${index * 45 + 150}ms`}
                              fill="freeze"
                            />
                          </text>
                        )}

                        {shouldShowXLabel && (
                          <text
                            x={point.x}
                            y={height - 18}
                            textAnchor={textAnchor}
                            className={`font-mono text-[10px] ${
                              isPeak
                                ? "fill-stone-900 font-bold"
                                : "fill-stone-400"
                            }`}
                          >
                            {point.l}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>
              )}
            </div>
          </div>
        </div>
      </Tile>
    </div>
  );
}
