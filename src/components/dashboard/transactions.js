import { Tile, TileHeader } from "@/components/dashboard/helpers";

export function Transactions({ data }) {
  return (
    <Tile
      hover={false}
      delay={500}
      className="relative h-full w-full p-5 overflow-hidden flex flex-col"
    >
      <TileHeader title="Recent Transactions" />

      <div className="mt-4 flex justify-end mb-4 shrink-0">
        <button
          onClick={() => {}}
          className="font-mono text-[10px] font-semibold text-stone-500 hover:text-stone-800
                     border-b border-stone-300 hover:border-stone-700 pb-px
                     transition-colors duration-150 tracking-wider uppercase"
        >
          View all
        </button>
      </div>

      <div
        className="flex-1 min-h-0 overflow-hidden"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 78%, transparent 100%)",
          maskImage:
            "linear-gradient(to bottom, black 0%, black 78%, transparent 100%)",
        }}
      >
        <div className="divide-y divide-stone-100/80">
          {data.recentTxns.map((tx, i) => (
            <div
              key={tx.id}
              role="button"
              tabIndex={0}
              onClick={() => {}}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") e.preventDefault();
              }}
              className="
                flex items-center justify-between
                py-3 first:pt-0 last:pb-0
                opacity-0 animate-[fadeSlideIn_0.4s_ease_forwards]
                cursor-pointer rounded-[3px] px-2 -mx-2
                border-l-2 border-l-transparent hover:border-l-stone-700
                hover:bg-stone-100 transition-colors duration-150
              "
              style={{ animationDelay: `${550 + i * 50}ms` }}
            >
              {/* left: avatar + name */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`
                    w-8 h-8 rounded-sm flex items-center justify-center
                    text-[11px] font-bold font-mono shrink-0 border
                    ${
                      tx.amount > 0
                        ? "bg-stone-100 text-stone-700 border-stone-200"
                        : "bg-stone-50 text-stone-400 border-stone-150"
                    }
                  `}
                >
                  {tx.name[0]}
                </div>

                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-stone-800 truncate">
                    {tx.name}
                  </p>
                  <p className="font-mono text-[10px] text-stone-400 tracking-wider truncate">
                    {tx.cat} · {tx.date}
                  </p>
                </div>
              </div>

              {/* right: amount */}
              <p
                className={`
                  font-mono text-[13px] font-bold tabular-nums shrink-0
                  ${tx.amount > 0 ? "text-stone-600" : "text-stone-900"}
                `}
              >
                {tx.amount > 0 ? "+" : "−"}₹
                {Math.abs(tx.amount).toLocaleString("en-IN")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Tile>
  );
}
