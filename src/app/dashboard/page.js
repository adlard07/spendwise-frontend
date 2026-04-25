"use client";
import React, { useState, useEffect } from "react";
import { useMyContext } from "@/useContext/MyContext";
import { useRouter } from "next/navigation";
import { Header } from "@/components/utils/header";
import { Footer } from "@/components/utils/footer";
import { Loading } from "@/components/utils/loading";
import { LineGraph } from "@/components/dashboard/lineGraph";
import { PieGraph } from "@/components/dashboard/pieGraph";
import { Transactions } from "@/components/dashboard/transactions";
import { MetricsPanel } from "@/components/dashboard/metrics";
import {
  getTransactions,
  getExtras,
  transformTransactions,
  pieChartData,
} from "@/app/dashboard/helpers";
import { AddTransaction } from "@/components/transactions/addTransaction";

export default function Dashboard() {
  const { user, ready } = useMyContext();
  const router = useRouter();
  const [transactions, setTransactions] = useState(null);
  const [metrics, setMetrics] = useState({});
  const [openAddTransaction, setOpenAddTransaction] = useState(false);

  async function loadData() {
    try {
      const token = localStorage.getItem("access_token");
      const rawTransactions = await getTransactions({
        userId: user.userId,
        token,
      });
      const extras = await getExtras({ userId: user.userId, token });
      setTransactions(transformTransactions(rawTransactions));
      setMetrics(extras?.metrics);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    }
  }

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    loadData();
  }, [ready, user, router, loadData]);

  if (!ready || !transactions)
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <Loading />
      </div>
    );

  return (
    <div className="min-h-screen bg-stone-100">
      <main className="max-w-full mx-auto p-8">
        <div className="flex flex-col gap-8">
          <Header pageName="Dashboard" />

          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 items-start">
            <div className="grid auto-rows-auto gap-6">
              <div className="flex flex-col gap-3">
                {" "}
                <div className="flex items-center justify-between shrink-0">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-stone-400">
                    Spending Overview
                  </p>
                  <button
                    onClick={() => setOpenAddTransaction(true)}
                    className="
                      flex items-center gap-2 px-4 py-2
                      bg-stone-900 text-gray-400
                      font-mono text-[11px] font-semibold tracking-widest uppercase
                      border border-stone-800
                      rounded-sm
                      transition-all duration-200
                      hover:bg-stone-700 hover:border-stone-600
                      active:scale-[0.98]
                    "
                  >
                    <span className="text-amber-400 text-base leading-none">
                      +
                    </span>
                    Add Transaction
                  </button>
                </div>
                <div className="flex-1 min-h-0 bg-white border border-stone-200 border-t-2 border-t-stone-800 rounded-sm shadow-sm">
                  <LineGraph data={transactions} />
                </div>
              </div>

              <div className="bg-white border border-stone-200 border-t-2 border-t-stone-800 rounded-sm shadow-sm">
                {" "}
                <Transactions data={transactions} />
              </div>
            </div>

            <div className="grid auto-rows-auto gap-6">
              {" "}
              <div className="bg-white border border-stone-200 border-t-2 border-t-amber-700 rounded-sm shadow-sm">
                {" "}
                <PieGraph data={pieChartData} />
              </div>
            </div>
          </div>
          <div className="min-h-0 h-full bg-white border border-stone-200 border-t-2 border-t-amber-700 rounded-sm shadow-sm">
            <MetricsPanel data={metrics} />
          </div>

          <Footer />
        </div>
      </main>

      {openAddTransaction && (
        <AddTransaction
          onClose={() => setOpenAddTransaction(false)}
          onSuccess={() => {
            setOpenAddTransaction(false);
            loadData();
          }}
        />
      )}
    </div>
  );
}
