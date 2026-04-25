import { Ico } from "@/components/transactions/helpers";

export function SortH({ label, field, sf, sd, toggle }) {
  const active = sf === field;
  return (
    <button onClick={() => toggle(field)} className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest cursor-pointer group">
      <span className={active ? "text-stone-900" : "text-stone-400 group-hover:text-stone-600"}>{label}</span>
      {active && <span className="text-stone-700">{sd === "asc" ? <Ico.SortUp className="w-3 h-3" /> : <Ico.SortDown className="w-3 h-3" />}</span>}
    </button>
  );
}
