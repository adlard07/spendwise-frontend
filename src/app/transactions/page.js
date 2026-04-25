"use client";

import {useFilters} from "@/lib/hooks";
import { Table } from "@/components/transactions/table";
import { Filters } from "@/components/transactions/filter";
import { Pager } from "@/components/transactions/pager";
import { MobileCard } from "@/components/transactions/mobileCard";
import { MOCK } from "@/components/transactions/helpers";

export default function TransactionsPage() {

  const f = useFilters(MOCK);

  return (
    <div className="min-h-screen bg-stone-50 px-4 py-6 md:px-8 lg:px-12 xl:px-16">
      {/* Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-stone-950 tracking-tight leading-none" style={{ fontFamily: "'Playfair Display', serif" }}>
            Spendwise
          </h1>
          <p className="mt-1 text-sm text-stone-500 font-medium tracking-wide uppercase">
            Transactions
          </p>
        </div>
        <span className="text-xs text-stone-400 font-mono hidden sm:block">All records</span>
      </div>

      <div className="space-y-4">
        <Filters f={f} />
        {/* Desktop table */}
        <div className="hidden md:block"><Table f={f} /></div>
        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {f.paginated.length === 0 && <div className="text-center py-12 text-sm text-stone-400">No transactions match your filters.</div>}
          {f.paginated.map(txn => <MobileCard key={txn.id} txn={txn} f={f} />)}
        </div>
        <Pager f={f} />
      </div>
    </div>
  );
}