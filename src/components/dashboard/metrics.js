import {
  Tile,
  ChevronRight,
  TrendArrow,
  TileHeader,
} from "@/components/dashboard/helpers";

const METRIC_LABELS = {
  total_spend: "Total Spend",
  avg_daily_spend: "Avg Daily Spend",
  largest_expense: "Largest Expense",
  top_category: "Top Category",
  bottom_category: "Bottom Category",
  estimated_budget: "Estimated Budget",
  budget_used: "Budget Used",
  total_budget: "Total Budget",
};

const CURRENCY_FIELDS = new Set([
  "total_spend",
  "avg_daily_spend",
  "largest_expense",
  "estimated_budget",
  "budget_used",
  "total_budget",
]);

function formatLabel(key) {
  return (
    METRIC_LABELS[key] ||
    key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
  );
}

function formatValue(key, value) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  if (CURRENCY_FIELDS.has(key) && typeof value === "number") {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  }

  return value;
}

function normalizeMetrics(metrics = []) {
  return metrics
    .map((metric) => {
      const [key, data] = Object.entries(metric || {})[0] || [];

      if (!key || !data) return null;

      return {
        id: key,
        key,
        label: formatLabel(key),
        value: formatValue(key, data.value),
        rawValue: data.value,
        sub: data.comment || "",
        trend: data.trend,
        up: data.up,
        progress:
          key === "budget_used" && typeof data.value === "number"
            ? Math.min(Math.max(data.value, 0), 100)
            : data.progress,
      };
    })
    .filter(Boolean);
}

export function MetricsPanel({ data }) {
  const metrics = normalizeMetrics(data);

  return (
    <div className="h-full">
      <Tile
        hover={false}
        delay={100}
        className="p-6 h-full flex flex-col overflow-hidden"
      >
        <TileHeader title="Metrics" subtitle="" />

        <div className="mt-4 flex gap-3 flex-1 min-h-0 content-start">
          {metrics.length > 0 ? (
            metrics.map((m, i) => (
              <Tile
                key={m.id}
                delay={i * 80 + 150}
                className="px-5 py-4 border-l-2 border-l-stone-200 hover:border-l-stone-800 hover:bg-stone-50 transition-colors duration-150"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-[10px] font-semibold tracking-[0.18em] uppercase text-stone-400">
                      {m.label}
                    </p>

                    <p className="font-['Playfair_Display',Georgia,serif] text-[22px] text-stone-950 mt-1 truncate">
                      {m.value}
                    </p>

                    {(m.sub || m.trend) && (
                      <div className="flex items-center gap-2 mt-2">
                        {m.sub && (
                          <span className="font-mono text-[11px] text-stone-400">
                            {m.sub}
                          </span>
                        )}
                        {m.trend && (
                          <span
                            className={`
                              inline-flex items-center gap-1 font-mono text-[10px] font-semibold
                              px-1.5 py-0.5 rounded border
                              ${
                                m.up
                                  ? "border-emerald-200 text-emerald-700"
                                  : "border-red-200 text-red-600"
                              }
                            `}
                          >
                            <TrendArrow up={m.up} />
                            {m.trend}
                          </span>
                        )}
                      </div>
                    )}

                    {m.progress !== undefined && (
                      <div className="mt-3 h-px bg-stone-100 overflow-hidden rounded-full">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ease-out ${
                            m.progress > 90 ? "bg-red-300" : "bg-stone-700"
                          }`}
                          style={{ width: `${m.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="text-stone-200 shrink-0">
                    <ChevronRight />
                  </div>
                </div>
              </Tile>
            ))
          ) : (
            <div className="text-[11px] text-stone-400 font-mono tracking-widest uppercase">
              No metrics available
            </div>
          )}
        </div>
      </Tile>
    </div>
  );
}
