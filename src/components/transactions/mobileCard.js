import { CatBadge, Avatar, CopyId, chop, fmtDate, fmtAmt } from "@/components/transactions/helpers";
import { Ico } from "@/components/transactions/helpers";
import { ic } from "@/components/transactions/helpers";

export function MobileCard({ txn, f }) {
  const hid = f.hidIds.has(txn.id);
  const sel = f.selIds.has(txn.id);
  return (
    <div className={`tile p-4 ${hid ? "opacity-40" : ""} ${sel ? "bg-amber-50/40" : ""}`}>
      <div className="flex items-start gap-3">
        <div className="flex flex-col items-center gap-2 pt-0.5">
          <input type="checkbox" checked={sel} onChange={() => f.toggleSel(txn.id)} className="w-3.5 h-3.5 rounded-sm accent-stone-700 cursor-pointer" />
          <Avatar title={txn.title} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div><h3 className="text-sm font-semibold text-stone-900">{txn.title}</h3><p className="text-xs text-stone-500 mt-0.5" title={txn.description}>{chop(txn.description)}</p></div>
            <span className="text-sm font-bold text-stone-950 shrink-0 tabular-nums">{fmtAmt(txn.amount)}</span>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <CopyId id={txn.id} />
            <span className="text-[10px] text-stone-400 font-mono">{fmtDate(txn.timestamp).date}</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">{txn.categories.map(c => <CatBadge key={c} cat={c} />)}</div>
          <div className="flex items-center gap-1 mt-3 pt-2 border-t border-stone-100">
            <button onClick={() => f.toggleHid(txn.id)} className="p-1.5 rounded-sm text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer">{hid ? <Ico.EyeOff className={ic}/> : <Ico.Eye className={ic}/>}</button>
            <button className="p-1.5 rounded-sm text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"><Ico.Edit className={ic}/></button>
            <button className="p-1.5 rounded-sm text-stone-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"><Ico.Trash className={ic}/></button>
          </div>
        </div>
      </div>
    </div>
  );
}
