export function ChevronRight({ className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={`w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 ${className}`}
    >
      <path
        fillRule="evenodd"
        d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function TrendArrow({ up }) {
  return (
    <svg
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="none"
      className={`${up ? "" : "rotate-180"}`}
    >
      <path d="M4 1L7 5H1L4 1Z" fill="currentColor" />
    </svg>
  );
}

export function Tile({ children, className = "", hover = true, delay = 0 }) {
  return (
    <div
      className={`
        bg-white/70 backdrop-blur-sm rounded-none
        border border-stone-200/80
        shadow-[4px_4px_0px_0px_rgba(120,100,80,0.1)]
        ${hover ? "group cursor-pointer hover:shadow-[6px_6px_0px_0px_rgba(120,100,80,0.2)] hover:-translate-y-px active:shadow-[2px_2px_0px_0px_rgba(120,100,80,0.08)] active:translate-y-0" : ""}
        transition-all duration-300 ease-out
        opacity-0 animate-[fadeSlideIn_0.5s_ease_forwards]
        ${className}
      `}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function fmt(v) {
  if (v >= 100000) return `₹${(v / 1000).toFixed(0)}k`;
  if (v >= 1000) return `₹${(v / 1000).toFixed(1)}k`;
  return `₹${v}`;
}

export function TileHeader({ title, subtitle }) {
  return (
    <div className="flex flex-col gap-1 border-b border-stone-400/60">
      <h3 className="font-mono text-[16px] font-bold tracking-[0.14em] uppercase text-stone-600 opacity-0 animate-[fadeSlideIn_0.5s_ease_forwards]">
        {title}
      </h3>
      <p className="text-xs text-stone-600 opacity-0 animate-[fadeSlideIn_0.5s_ease_forwards]">
        {subtitle}
      </p>
    </div>
  );
}
