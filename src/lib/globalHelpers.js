export function decodeAccessToken(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    console.log("Raw JWT payload:", payload);

    if (payload.exp * 1000 < Date.now()) return null;
    return {
      userId: payload.user_id,
      email: payload.email,
      exp: payload.exp,
    };
  } catch {
    return null;
  }
}

export const insights = {
  "Spending Habits": {
    page: "spending_habits",
    title: "Spending Habits",
    desc: "Patterns in your daily and weekly spending.",
    icon: "👁",
  },
  "Budget Overview": {
    page: "budget_overview",
    title: "Budget Overview",
    desc: "How you're tracking against budgets.",
    icon: "💰",
  },
  "Managing Finances": {
    page: "managing_finances",
    title: "Managing Finances",
    desc: "Progress toward savings goals.",
    icon: "📊",
  },
  "Goal Insights": {
    page: "goals_insights",
    title: "Goal Insights",
    desc: "Progress toward savings goals.",
    icon: "🚩",
  },
  "AI Insights": {
    page: "ai_insights",
    title: "AI Insights",
    desc: "Smart suggestions from your DATA.",
    icon: "✨",
  },
};
