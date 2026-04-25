import { useState } from "react";
import { Ico } from "@/components/transactions/helpers";


export function Filters({ f }) {
  const [open, setOpen] = useState(false);


  return (
    <div className="tile p-4 space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Ico.Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input type="text" placeholder="Search title, description, or ID..." value={f.search} onChange={e => f.setSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-400/30" />
          {f.search && <button onClick={() => f.setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"><Ico.X className="w-3.5 h-3.5" /></button>}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setOpen(!open)}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-sm border transition-all cursor-pointer ${open || f.hasFilters ? "bg-stone-800 text-stone-50 border-stone-800" : "bg-stone-50 text-stone-600 border-stone-200 hover:border-stone-400"}`}>
            <Ico.Filter className="w-3.5 h-3.5" /> Filters {f.hasFilters && <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-white/20 rounded-sm">ON</span>}
          </button>
          {f.hasFilters && <button onClick={f.clearAll} className="text-xs text-stone-500 hover:text-red-600 font-semibold underline underline-offset-2 cursor-pointer">Clear all</button>}
          <span className="text-xs text-stone-400 font-mono ml-auto sm:ml-2">{f.filteredCount}/{f.total}</span>
        </div>
      </div>
      {open && (
        <div className="space-y-4 pt-3 border-t border-stone-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-1.5">Amount Range (₹)</label>
              <div className="flex gap-2 items-center">
                <input type="number" placeholder="Min" value={f.amtRange.min} onChange={e => f.setAmtRange(p => ({...p, min: e.target.value}))}
                  className="flex-1 px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-500 font-mono" />
                <span className="text-stone-300 text-xs">—</span>
                <input type="number" placeholder="Max" value={f.amtRange.max} onChange={e => f.setAmtRange(p => ({...p, max: e.target.value}))}
                  className="flex-1 px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-500 font-mono" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-1.5">Date Range</label>
              <div className="flex gap-2 items-center">
                <input type="date" value={f.dateRange.from} onChange={e => f.setDateRange(p => ({...p, from: e.target.value}))}
                  className="flex-1 px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-sm text-stone-900 focus:outline-none focus:border-stone-500 font-mono" />
                <span className="text-stone-300 text-xs">—</span>
                <input type="date" value={f.dateRange.to} onChange={e => f.setDateRange(p => ({...p, to: e.target.value}))}
                  className="flex-1 px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-sm text-stone-900 focus:outline-none focus:border-stone-500 font-mono" />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-2">Categories</label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => f.toggleCat(c)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-sm border transition-all cursor-pointer ${f.selCats.includes(c) ? "bg-stone-700 text-stone-50 border-stone-700" : "bg-stone-50 text-stone-600 border-stone-200 hover:border-stone-400"}`}>{c}</button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
