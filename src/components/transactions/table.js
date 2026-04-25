import { SortH } from "./header";
import { CatBadge, Avatar, CopyId, chop, fmtDate, fmtAmt } from "@/components/transactions/helpers";
import { useState } from "react";
import { Ico } from "@/components/transactions/helpers";
import { ic } from "@/components/transactions/helpers";


export function Table({ f }) {
  const allSel = f.paginated.length > 0 && f.paginated.every(t => f.selIds.has(t.id));

  return (
    <div className="tile p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px]">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-100/60">
              <th className="w-10 px-4 py-3"><input type="checkbox" checked={allSel} onChange={f.toggleSelAll} className="w-3.5 h-3.5 rounded-sm accent-stone-700 cursor-pointer" /></th>
              <th className="w-10 px-2 py-3" />
              <th className="px-3 py-3 text-left"><SortH label="ID" field="id" sf={f.sortField} sd={f.sortDir} toggle={f.toggleSort} /></th>
              <th className="px-3 py-3 text-left"><SortH label="Title" field="title" sf={f.sortField} sd={f.sortDir} toggle={f.toggleSort} /></th>
              <th className="px-3 py-3 text-left"><span className="text-[10px] font-semibold uppercase tracking-widest text-stone-400">Description</span></th>
              <th className="px-3 py-3 text-left"><SortH label="Timestamp" field="timestamp" sf={f.sortField} sd={f.sortDir} toggle={f.toggleSort} /></th>
              <th className="px-3 py-3 text-left"><span className="text-[10px] font-semibold uppercase tracking-widest text-stone-400">Categories</span></th>
              <th className="px-3 py-3 text-right"><SortH label="Amount" field="amount" sf={f.sortField} sd={f.sortDir} toggle={f.toggleSort} /></th>
              <th className="px-3 py-3 text-center"><span className="text-[10px] font-semibold uppercase tracking-widest text-stone-400">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {f.paginated.map(txn => {
              const hid = f.hidIds.has(txn.id);
              const sel = f.selIds.has(txn.id);
              const { date, time } = fmtDate(txn.timestamp);
              return (
                <tr key={txn.id} className={`border-b border-stone-100 last:border-b-0 transition-colors ${sel ? "bg-amber-50/40" : "hover:bg-stone-50/60"} ${hid ? "opacity-40" : ""}`}>
                  <td className="px-4 py-3"><input type="checkbox" checked={sel} onChange={() => f.toggleSel(txn.id)} className="w-3.5 h-3.5 rounded-sm accent-stone-700 cursor-pointer" /></td>
                  <td className="px-2 py-3"><Avatar title={txn.title} /></td>
                  <td className="px-3 py-3"><CopyId id={txn.id} /></td>
                  <td className="px-3 py-3"><span className="text-sm font-semibold text-stone-900">{txn.title}</span></td>
                  <td className="px-3 py-3"><span className="text-xs text-stone-500" title={txn.description}>{chop(txn.description)}</span></td>
                  <td className="px-3 py-3"><div className="text-xs text-stone-700 font-medium">{date}</div><div className="text-[10px] text-stone-400 font-mono">{time}</div></td>
                  <td className="px-3 py-3"><div className="flex flex-wrap gap-1">{txn.categories.map(c => <CatBadge key={c} cat={c} />)}</div></td>
                  <td className="px-3 py-3 text-right"><span className="text-sm font-bold text-stone-950 tabular-nums">{fmtAmt(txn.amount)}</span></td>
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => f.toggleHid(txn.id)} className="p-1.5 rounded-sm text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer" title={hid?"Show":"Hide"}>
                        {hid ? <Ico.EyeOff className={ic}/> : <Ico.Eye className={ic}/>}
                      </button>
                      <button className="p-1.5 rounded-sm text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer" title="Edit"><Ico.Edit className={ic}/></button>
                      <button className="p-1.5 rounded-sm text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer" title="Delete"><Ico.Trash className={ic}/></button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {f.paginated.length === 0 && <tr><td colSpan={9} className="px-4 py-12 text-center text-sm text-stone-400">No transactions match your filters.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}