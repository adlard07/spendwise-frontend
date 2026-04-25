"use client";

import { useState, useMemo, useCallback } from "react";

export function useFilters(data) {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("timestamp");
  const [sortDir, setSortDir] = useState("desc");
  const [selCats, setSelCats] = useState([]);
  const [amtRange, setAmtRange] = useState({ min: "", max: "" });
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [page, setPage] = useState(1);
  const [selIds, setSelIds] = useState(new Set());
  const [hidIds, setHidIds] = useState(new Set());


  const filtered = useMemo(() => {
    let r = [...data];
    if (search.trim()) { const q = search.toLowerCase(); r = r.filter(t => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.id.toLowerCase().includes(q)); }
    if (selCats.length) r = r.filter(t => t.categories.some(c => selCats.includes(c)));
    if (amtRange.min !== "") r = r.filter(t => t.amount >= +amtRange.min);
    if (amtRange.max !== "") r = r.filter(t => t.amount <= +amtRange.max);
    if (dateRange.from) r = r.filter(t => t.timestamp >= dateRange.from);
    if (dateRange.to) r = r.filter(t => t.timestamp <= dateRange.to + "T23:59:59");
    r.sort((a, b) => {
      let va = a[sortField], vb = b[sortField];
      if (sortField === "amount") { va = +va; vb = +vb; }
      else if (sortField === "timestamp") { va = new Date(va).getTime(); vb = new Date(vb).getTime(); }
      else { va = String(va).toLowerCase(); vb = String(vb).toLowerCase(); }
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return r;
  }, [data, search, sortField, sortDir, selCats, amtRange, dateRange]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = useMemo(() => filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE), [filtered, safePage]);

  const toggleSort = useCallback((f) => {
    setSortField(p => { if (p === f) { setSortDir(d => d === "asc" ? "desc" : "asc"); return p; } setSortDir("desc"); return f; });
    setPage(1);
  }, []);
  const toggleCat = useCallback((c) => { setSelCats(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c]); setPage(1); }, []);
  const toggleSel = useCallback((id) => setSelIds(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; }), []);
  const toggleSelAll = useCallback(() => setSelIds(p => { const ids = paginated.map(t => t.id); const all = ids.every(id => p.has(id)); const n = new Set(p); ids.forEach(id => all ? n.delete(id) : n.add(id)); return n; }), [paginated]);
  const toggleHid = useCallback((id) => setHidIds(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; }), []);
  const hasFilters = search.trim() || selCats.length || amtRange.min !== "" || amtRange.max !== "" || dateRange.from || dateRange.to;
  const clearAll = useCallback(() => { setSearch(""); setSelCats([]); setAmtRange({ min: "", max: "" }); setDateRange({ from: "", to: "" }); setPage(1); }, []);

  return {
    search, setSearch, sortField, sortDir, toggleSort,
    selCats, toggleCat, amtRange, setAmtRange, dateRange, setDateRange,
    page: safePage, setPage: (p) => setPage(Math.max(1, Math.min(p, totalPages))), totalPages,
    filtered, paginated,
    selIds, toggleSel, toggleSelAll,
    hidIds, toggleHid,
    hasFilters, clearAll,
    total: data.length, filteredCount: filtered.length,
  };
}

export const PER_PAGE = 8;