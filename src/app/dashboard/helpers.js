"use client";

import { BASE_URL } from "@/config";

export function getTransactions({ userId, token }) {
  return fetch(`${BASE_URL}/transactions/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ user_id: userId }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch transactions");
      return res.json();
    })
    .catch((err) => console.error(err));
}

export function getExtras({ userId, token }) {
  const requiredFields = [
    "total_spend",
    "avg_daily_spend",
    "largest_expense",
    "top_category",
    "bottom_category",
    "estimated_budget",
    "budget_used",
    "total_budget",
  ];
  return fetch(`${BASE_URL}/extras`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      user_id: userId,
      required_fields: requiredFields,
    }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch extras");
      return res.json();
    })
    .catch((err) => console.error(err));
}

// ─── Transform raw API response → DATA shape ────────────────────────────────

function fmt(ts) {
  const d = new Date(ts);
  return {
    hour: d
      .toLocaleTimeString("en-IN", { hour: "numeric", hour12: true })
      .replace(" ", ""), // "6am"
    day: d.toLocaleDateString("en-IN", { weekday: "short" }), // "Mon"
    week: `W${Math.ceil(d.getDate() / 7)}`, // "W1"
    month: d.toLocaleDateString("en-IN", { month: "short" }), // "Jan"
    year: String(d.getFullYear()), // "2025"
  };
}

function bucketBy(txns, keyFn) {
  return txns.reduce((acc, t) => {
    const k = keyFn(t);
    acc[k] = (acc[k] ?? 0) + Math.abs(t.amount);
    return acc;
  }, {});
}

function toChartPoints(bucketObj) {
  return Object.entries(bucketObj).map(([l, v]) => ({ l, v }));
}

export function transformTransactions(raw) {
  const txns = raw?.data ?? [];

  const now = new Date();
  const oneDayAgo = new Date(now - 86400000);
  const oneWeekAgo = new Date(now - 7 * 86400000);
  const oneMonAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    now.getDate(),
  );
  const oneYearAgo = new Date(
    now.getFullYear() - 1,
    now.getMonth(),
    now.getDate(),
  );

  const filter = (from) => txns.filter((t) => new Date(t.timestamp) >= from);

  const chart = {
    "1D": toChartPoints(
      bucketBy(filter(oneDayAgo), (t) => fmt(t.timestamp).hour),
    ),
    "1W": toChartPoints(
      bucketBy(filter(oneWeekAgo), (t) => fmt(t.timestamp).day),
    ),
    "1M": toChartPoints(
      bucketBy(filter(oneMonAgo), (t) => fmt(t.timestamp).week),
    ),
    "1Y": toChartPoints(
      bucketBy(filter(oneYearAgo), (t) => fmt(t.timestamp).month),
    ),
    ALL: toChartPoints(bucketBy(txns, (t) => fmt(t.timestamp).year)),
  };

  // ── metrics ──────────────────────────────────────────────────────────────
  const thisMonth = txns.filter((t) => {
    const d = new Date(t.timestamp);
    return (
      d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    );
  });

  const totalSpend = thisMonth
    .filter((t) => t.transaction_type === "expense")
    .reduce((s, t) => s + Math.abs(t.amount), 0);

  const avgDaily = totalSpend / (now.getDate() || 1);

  const largest = thisMonth.reduce(
    (max, t) => (Math.abs(t.amount) > Math.abs(max.amount ?? 0) ? t : max),
    {},
  );

  const catTotals = thisMonth
    .filter((t) => t.transaction_type === "expense")
    .reduce((acc, t) => {
      acc[t.category_id] = (acc[t.category_id] ?? 0) + Math.abs(t.amount);
      return acc;
    }, {});
  const topCat = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0] ?? [
    "—",
    0,
  ];

  const metrics = [
    {
      id: "ts",
      label: "Total Spend",
      value: `₹${totalSpend.toLocaleString("en-IN")}`,
      sub: "this month",
    },
    {
      id: "ad",
      label: "Avg. Daily",
      value: `₹${Math.round(avgDaily).toLocaleString("en-IN")}`,
      sub: "30-day avg",
    },
    {
      id: "le",
      label: "Largest Expense",
      value: `₹${Math.abs(largest.amount ?? 0).toLocaleString("en-IN")}`,
      sub: `${largest.merchant_id ?? "—"} · ${largest.timestamp?.slice(0, 10) ?? ""}`,
    },
    {
      id: "tc",
      label: "Top Category",
      value: topCat[0],
      sub: `₹${topCat[1].toLocaleString("en-IN")}`,
    },
  ];

  // ── recent transactions ───────────────────────────────────────────────────
  const recentTxns = [...txns]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 6)
    .map((t) => ({
      id: t.transaction_id,
      name: t.merchant_id,
      cat: t.category_id,
      amount:
        t.transaction_type === "expense"
          ? -Math.abs(t.amount)
          : Math.abs(t.amount),
      date: new Date(t.timestamp).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      }),
    }));

  return { chart, metrics, recentTxns };
}

export const RANGES = ["1D", "1W", "1M", "1Y", "ALL"];

export const DATA = {
  chart: {
    "1D": [
      { l: "6am", v: 120 },
      { l: "9am", v: 340 },
      { l: "12pm", v: 580 },
      { l: "3pm", v: 220 },
      { l: "6pm", v: 460 },
      { l: "9pm", v: 190 },
    ],
    "1W": [
      { l: "Mon", v: 850 },
      { l: "Tue", v: 620 },
      { l: "Wed", v: 1100 },
      { l: "Thu", v: 430 },
      { l: "Fri", v: 780 },
      { l: "Sat", v: 1250 },
      { l: "Sun", v: 340 },
    ],
    "1M": [
      { l: "W1", v: 3200 },
      { l: "W2", v: 4100 },
      { l: "W3", v: 2800 },
      { l: "W4", v: 3600 },
    ],
    "1Y": [
      { l: "Jan", v: 12000 },
      { l: "Feb", v: 9800 },
      { l: "Mar", v: 11200 },
      { l: "Apr", v: 8400 },
      { l: "May", v: 10600 },
      { l: "Jun", v: 13200 },
      { l: "Jul", v: 7800 },
      { l: "Aug", v: 9200 },
      { l: "Sep", v: 11800 },
      { l: "Oct", v: 10100 },
      { l: "Nov", v: 14200 },
      { l: "Dec", v: 12800 },
    ],
    ALL: [
      { l: "2021", v: 98000 },
      { l: "2022", v: 112000 },
      { l: "2023", v: 105000 },
      { l: "2024", v: 124000 },
      { l: "2025", v: 87000 },
    ],
  },
  metrics: [
    {
      id: "ts",
      label: "Total Spend",
      value: "₹1,24,000",
      sub: "this month",
      trend: "+12%",
      up: true,
    },
    {
      id: "ad",
      label: "Avg. Daily",
      value: "₹4,133",
      sub: "30-day avg",
      trend: "-3%",
      up: false,
    },
    {
      id: "le",
      label: "Largest Expense",
      value: "₹18,500",
      sub: "Rent — Apr 1",
    },
    {
      id: "tc",
      label: "Top Category",
      value: "Food & Dining",
      sub: "₹32,400 (26%)",
      trend: "+8%",
      up: true,
    },
    {
      id: "bu",
      label: "Budget Used",
      value: "78%",
      sub: "₹96,720 / ₹1,24,000",
      progress: 78,
    },
  ],
  insights: [
    {
      id: "sh",
      title: "Spending Habits",
      desc: "Patterns in your daily and weekly spending.",
      icon: "👁",
    },
    {
      id: "bi",
      title: "Budget Insights",
      desc: "How you're tracking against budgets.",
      icon: "💰",
    },
    {
      id: "mf",
      title: "Managing Finances",
      desc: "Income, savings, and net flow overview.",
      icon: "📊",
    },
    {
      id: "gi",
      title: "Goals Insights",
      desc: "Progress toward savings goals.",
      icon: "🚩",
    },
    {
      id: "ai",
      title: "AI Insights",
      desc: "Smart suggestions from your DATA.",
      icon: "✨",
    },
  ],
  recentTxns: [
    { id: 1, name: "Swiggy", cat: "Food", amount: -482, date: "Today" },
    { id: 2, name: "Amazon", cat: "Shopping", amount: -2199, date: "Today" },
    {
      id: 3,
      name: "Salary Credit",
      cat: "Income",
      amount: 85000,
      date: "Apr 1",
    },
    {
      id: 4,
      name: "Netflix",
      cat: "Entertainment",
      amount: -649,
      date: "Mar 31",
    },
    { id: 5, name: "Uber", cat: "Transport", amount: -347, date: "Mar 30" },
    {
      id: 6,
      name: "Zerodha",
      cat: "Investment",
      amount: -5000,
      date: "Mar 29",
    },
  ],
};

export const pieChartData = {
  Food: 12000,
  Travel: 4500,
  Shopping: 8200,
  Bills: 6700,
  Entertainment: 2300,
};
