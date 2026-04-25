import { PAGE_SIZE } from "@/components/transactions/helpers";
import { Ico } from "@/components/transactions/helpers";
import { ic } from "@/components/transactions/helpers";

export function Pager({ f }) {
  if (f.totalPages <= 1) return null;
  const start = (f.page - 1) * PAGE_SIZE + 1;
  const end = Math.min(f.page * PAGE_SIZE, f.filteredCount);
  const pages = [];
  if (f.totalPages <= 7) { for (let i = 1; i <= f.totalPages; i++) pages.push(i); }
  else {
    pages.push(1);
    if (f.page > 3) pages.push("...");
    for (let i = Math.max(2, f.page - 1); i <= Math.min(f.totalPages - 1, f.page + 1); i++) pages.push(i);
    if (f.page < f.totalPages - 2) pages.push("...");
    pages.push(f.totalPages);
  }
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 px-1">
      <span className="text-xs text-stone-400 font-mono">{start}–{end} of {f.filteredCount}</span>
      <div className="flex items-center gap-1">
        <button onClick={() => f.setPage(f.page - 1)} disabled={f.page <= 1} className="p-2 rounded-sm border border-stone-200 text-stone-500 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"><Ico.ChevL className={ic}/></button>
        {pages.map((pg, i) => pg === "..." ? <span key={`e${i}`} className="px-1 text-xs text-stone-400">…</span> : (
          <button key={pg} onClick={() => f.setPage(pg)} className={`w-8 h-8 text-xs font-semibold rounded-sm border transition-all cursor-pointer ${f.page === pg ? "bg-stone-800 text-stone-50 border-stone-800" : "border-stone-200 text-stone-600 hover:bg-stone-100"}`}>{pg}</button>
        ))}
        <button onClick={() => f.setPage(f.page + 1)} disabled={f.page >= f.totalPages} className="p-2 rounded-sm border border-stone-200 text-stone-500 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"><Ico.ChevR className={ic}/></button>
      </div>
    </div>
  );
}
