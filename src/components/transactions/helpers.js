import { useState } from "react";

export function CatBadge({ cat }) {
  return (
    <span className={`inline-block px-2 py-0.5 text-[10px] font-semibold rounded-sm border whitespace-nowrap ${CAT_COLORS[cat] || "bg-gray-100 text-gray-700 border-gray-200"}`}>
      {cat}
    </span>
  );
}

export function Avatar({ title }) {
  const h = [...title].reduce((a, c) => c.charCodeAt(0) + ((a << 5) - a), 0);
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border border-black/10 shrink-0 ${AVA_COLORS[Math.abs(h) % AVA_COLORS.length]}`}>
      {title.charAt(0).toUpperCase()}
    </div>
  );
}

export function CopyId({ id }) {
  const [ok, setOk] = useState(false);
  const copy = async () => { try { await navigator.clipboard.writeText(id); setOk(true); setTimeout(() => setOk(false), 1200); } catch {} };
  return (
    <button onClick={copy} className="flex items-center gap-1 font-mono text-xs text-stone-500 hover:text-stone-800 transition-colors cursor-pointer group" title="Copy">
      <span>{id}</span>
      {ok ? <Ico.Check className={`${ic} text-emerald-600`}/> : <Ico.Copy className={`${ic} opacity-0 group-hover:opacity-100 transition-opacity`}/>}
    </button>
  );
}

export const chop = (t, n = 20) => (t.length <= n ? t : t.slice(0, n) + "…");

export const fmtAmt = (a) => "₹" + a.toLocaleString("en-IN");

export const fmtDate = (ts) => {
  const d = new Date(ts);
  return {
    date: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    time: d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }),
  };
};

export const Ico = {
    Search: (p) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...p}><path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd"/></svg>,
    Filter: (p) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...p}><path fillRule="evenodd" d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.591L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z" clipRule="evenodd"/></svg>,
    X: (p) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...p}><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"/></svg>,
    Eye: (p) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...p}><path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"/><path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41z" clipRule="evenodd"/></svg>,
    EyeOff: (p) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...p}><path fillRule="evenodd" d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38 1.651 1.651 0 000-1.185A10.004 10.004 0 009.999 3a9.956 9.956 0 00-4.744 1.194L3.28 2.22zM7.752 6.69l1.092 1.092a2.5 2.5 0 013.374 3.373l1.092 1.092a4 4 0 00-5.558-5.558z" clipRule="evenodd"/><path d="M10.748 13.93l2.523 2.523A9.987 9.987 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41a1.651 1.651 0 010-1.186 10.007 10.007 0 012.89-4.208L6.07 7.71A4 4 0 0010.748 13.93z"/></svg>,
    Edit: (p) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...p}><path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z"/></svg>,
    Trash: (p) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...p}><path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd"/></svg>,
    Copy: (p) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...p}><path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z"/><path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z"/></svg>,
    Check: (p) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...p}><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd"/></svg>,
    SortUp: (p) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...p}><path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z" clipRule="evenodd"/></svg>,
    SortDown: (p) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...p}><path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z" clipRule="evenodd"/></svg>,
    ChevL: (p) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...p}><path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd"/></svg>,
    ChevR: (p) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...p}><path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd"/></svg>,
};

export const AVA_COLORS = [
    "bg-amber-200 text-amber-800","bg-sky-200 text-sky-800",
    "bg-rose-200 text-rose-800","bg-emerald-200 text-emerald-800",
    ];

export const ic = "w-3.5 h-3.5";

export const CATEGORIES = [
    "Food & Dining","Transport","Shopping","Entertainment","Bills & Utilities",
    "Health","Education","Travel","Groceries","Subscriptions","Rent","Personal Care",
      ];
      
export const MOCK = [
      {id:"TXN-0041",title:"Swiggy Order",description:"Late night biryani order from Behrouz with extra raita",amount:485,timestamp:"2026-04-05T21:30:00",categories:["Food & Dining"],image:null},
      {id:"TXN-0040",title:"Uber Ride",description:"Ride from Andheri station to Goregaon office campus",amount:234,timestamp:"2026-04-05T09:15:00",categories:["Transport"],image:null},
      {id:"TXN-0039",title:"Amazon Purchase",description:"USB-C hub adapter and phone stand combo pack",amount:1899,timestamp:"2026-04-04T16:40:00",categories:["Shopping","Education"],image:null},
      {id:"TXN-0038",title:"Netflix",description:"Monthly premium subscription renewal auto-debit",amount:649,timestamp:"2026-04-04T00:01:00",categories:["Entertainment","Subscriptions"],image:null},
      {id:"TXN-0037",title:"Electricity Bill",description:"March month electricity bill payment via CESC portal",amount:2340,timestamp:"2026-04-03T11:20:00",categories:["Bills & Utilities"],image:null},
      {id:"TXN-0036",title:"Apollo Pharmacy",description:"Multivitamins and protein powder monthly refill order",amount:1245,timestamp:"2026-04-03T14:50:00",categories:["Health","Personal Care"],image:null},
      {id:"TXN-0035",title:"Udemy Course",description:"Advanced React patterns and performance optimization masterclass",amount:449,timestamp:"2026-04-02T20:10:00",categories:["Education"],image:null},
      {id:"TXN-0034",title:"D-Mart Groceries",description:"Weekly grocery run including vegetables fruits and snacks",amount:3200,timestamp:"2026-04-02T10:30:00",categories:["Groceries","Food & Dining"],image:null},
      {id:"TXN-0033",title:"Spotify Premium",description:"Annual plan renewal charged to credit card",amount:1189,timestamp:"2026-04-01T00:05:00",categories:["Entertainment","Subscriptions"],image:null},
      {id:"TXN-0032",title:"Rent Payment",description:"April month flat rent transfer to landlord account",amount:18500,timestamp:"2026-04-01T08:00:00",categories:["Rent","Bills & Utilities"],image:null},
      {id:"TXN-0031",title:"Zomato Gold",description:"Dinner at Bombay Canteen with friends using Gold membership",amount:2800,timestamp:"2026-03-31T20:45:00",categories:["Food & Dining"],image:null},
      {id:"TXN-0030",title:"Metro Card Recharge",description:"Monthly metro smart card top-up at station kiosk",amount:500,timestamp:"2026-03-31T08:30:00",categories:["Transport"],image:null},
      {id:"TXN-0029",title:"Myntra Order",description:"Running shoes Nike Pegasus size 10 with exchange offer",amount:4599,timestamp:"2026-03-30T15:20:00",categories:["Shopping","Personal Care"],image:null},
      {id:"TXN-0028",title:"PVR Cinemas",description:"Two IMAX tickets for weekend movie with popcorn combo",amount:1150,timestamp:"2026-03-30T18:00:00",categories:["Entertainment"],image:null},
      {id:"TXN-0027",title:"Water Bill",description:"Quarterly water supply bill payment for Q1 period",amount:780,timestamp:"2026-03-29T12:00:00",categories:["Bills & Utilities"],image:null},
      {id:"TXN-0026",title:"Gym Membership",description:"Cult.fit quarterly membership renewal with GST charges",amount:5400,timestamp:"2026-03-28T09:00:00",categories:["Health"],image:null},
      {id:"TXN-0025",title:"Book Purchase",description:"Designing Data Intensive Applications by Martin Kleppmann",amount:650,timestamp:"2026-03-27T14:30:00",categories:["Education","Shopping"],image:null},
      {id:"TXN-0024",title:"BigBasket Order",description:"Monthly essentials order including cleaning supplies and dairy",amount:2100,timestamp:"2026-03-26T11:00:00",categories:["Groceries"],image:null},
      {id:"TXN-0023",title:"Mobile Recharge",description:"Jio annual prepaid plan recharge with Disney+ Hotstar",amount:2999,timestamp:"2026-03-25T16:00:00",categories:["Bills & Utilities","Subscriptions"],image:null},
      {id:"TXN-0022",title:"Ola Auto",description:"Quick auto ride to nearby market for urgent supplies",amount:85,timestamp:"2026-03-25T10:20:00",categories:["Transport"],image:null},
      {id:"TXN-0021",title:"Starbucks",description:"Caramel macchiato and blueberry muffin at Powai outlet",amount:620,timestamp:"2026-03-24T16:45:00",categories:["Food & Dining"],image:null},
      {id:"TXN-0020",title:"Flight Booking",description:"Mumbai to Bangalore round trip for tech conference next month",amount:8900,timestamp:"2026-03-23T22:10:00",categories:["Travel","Transport"],image:null},
      {id:"TXN-0019",title:"Haircut",description:"Regular haircut and beard trim at neighbourhood salon",amount:350,timestamp:"2026-03-22T11:30:00",categories:["Personal Care"],image:null},
      {id:"TXN-0018",title:"iCloud Storage",description:"200GB iCloud storage monthly subscription auto-renewal",amount:219,timestamp:"2026-03-21T00:02:00",categories:["Subscriptions"],image:null},
      {id:"TXN-0017",title:"Petrol Fill",description:"Full tank petrol fill at HP station near highway",amount:3500,timestamp:"2026-03-20T07:45:00",categories:["Transport"],image:null},
      ];
    
    
export const CAT_COLORS = {
      "Food & Dining":"bg-amber-100 text-amber-800 border-amber-200",
      "Transport":"bg-blue-50 text-blue-700 border-blue-200",
      "Shopping":"bg-pink-50 text-pink-700 border-pink-200",
      "Entertainment":"bg-purple-50 text-purple-700 border-purple-200",
      "Bills & Utilities":"bg-slate-100 text-slate-700 border-slate-200",
      "Health":"bg-emerald-50 text-emerald-700 border-emerald-200",
      "Education":"bg-indigo-50 text-indigo-700 border-indigo-200",
      "Travel":"bg-cyan-50 text-cyan-700 border-cyan-200",
      "Groceries":"bg-lime-50 text-lime-700 border-lime-200",
      "Subscriptions":"bg-violet-50 text-violet-700 border-violet-200",
      "Rent":"bg-red-50 text-red-700 border-red-200",
      "Personal Care":"bg-rose-50 text-rose-700 border-rose-200",
      };

export const PAGE_SIZE = 8;