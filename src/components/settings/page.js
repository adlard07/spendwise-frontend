"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Icon } from "@/shared/ui/Icon";
import { BottomNav } from "@/shared/ui/BottomNav";
import { useStore } from "@/shared/hooks/useStore";
import {
  getCategories,
  getAccounts,
  addCategory,
  deleteCategory,
  addAccount,
  deleteAccount,
  getUniqueMerchants,
  getMerchantAliases,
  setMerchantAlias,
  removeMerchantAlias,
  exportCSV,
  initStore,
} from "@/lib/store";

export default function SettingsPage() {
  const { data: categories, refresh: refreshCats } = useStore(getCategories, []);
  const { data: accounts, refresh: refreshAccs } = useStore(getAccounts, []);

  const [activeSection, setActiveSection] = useState(null); // "categories" | "accounts" | "merchants" | null
  const [merchants, setMerchants] = useState([]);
  const [aliases, setAliases] = useState({});

  // Category form
  const [newCatName, setNewCatName] = useState("");
  const [newCatEmoji, setNewCatEmoji] = useState("📦");

  // Account form
  const [newAccName, setNewAccName] = useState("");

  // Merchant merge form
  const [mergeFrom, setMergeFrom] = useState("");
  const [mergeTo, setMergeTo] = useState("");

  useEffect(() => {
    initStore();
    setMerchants(getUniqueMerchants());
    setAliases(getMerchantAliases());
  }, []);

  const refreshMerchants = () => {
    setMerchants(getUniqueMerchants());
    setAliases(getMerchantAliases());
  };

  // Category CRUD
  const handleAddCategory = () => {
    if (!newCatName.trim()) return;
    addCategory({ name: newCatName.trim(), emoji: newCatEmoji });
    setNewCatName("");
    setNewCatEmoji("📦");
    refreshCats();
  };

  const handleDeleteCategory = (id) => {
    if (["cat_other"].includes(id)) return;
    deleteCategory(id);
    refreshCats();
  };

  // Account CRUD
  const handleAddAccount = () => {
    if (!newAccName.trim()) return;
    addAccount({ name: newAccName.trim() });
    setNewAccName("");
    refreshAccs();
  };

  const handleDeleteAccount = (id) => {
    deleteAccount(id);
    refreshAccs();
  };

  // Merchant merge
  const handleMerge = () => {
    if (!mergeFrom.trim() || !mergeTo.trim()) return;
    setMerchantAlias(mergeFrom.trim(), mergeTo.trim());
    setMergeFrom("");
    setMergeTo("");
    refreshMerchants();
  };

  const handleRemoveAlias = (alias) => {
    removeMerchantAlias(alias);
    refreshMerchants();
  };

  // Export
  const handleExport = () => {
    const csv = exportCSV();
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `brewhisper-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md px-6 pt-14 pb-4 border-b border-primary/10">
        <h1 className="text-2xl font-bold tracking-tight text-espresso">Settings</h1>
      </header>

      <main className="flex-1 px-4 py-6 space-y-8 pb-32">
        {/* Data Management */}
        <section>
          <h3 className="text-[11px] font-bold text-primary/70 uppercase tracking-widest px-2 mb-3">
            Data Management
          </h3>
          <div className="bg-card rounded-2xl shadow-sm overflow-hidden border border-primary/5">
            {/* Categories */}
            <button
              onClick={() => setActiveSection(activeSection === "categories" ? null : "categories")}
              className="w-full flex items-center gap-4 px-4 py-4 hover:bg-primary/5 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Icon name="category" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-espresso">Manage Categories</p>
                <p className="text-xs text-coffee-muted">{categories.length} categories</p>
              </div>
              <Icon
                name={activeSection === "categories" ? "expand_less" : "chevron_right"}
                className="text-coffee-muted/40"
              />
            </button>

            {activeSection === "categories" && (
              <div className="px-4 pb-4 space-y-3 border-t border-cream-soft pt-3">
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between bg-cream-soft/50 rounded-xl px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{cat.emoji}</span>
                      <span className="text-sm font-semibold text-espresso">{cat.name}</span>
                    </div>
                    {cat.id !== "cat_other" && (
                      <button onClick={() => handleDeleteCategory(cat.id)} className="text-danger/60 hover:text-danger">
                        <Icon name="delete_outline" size={20} />
                      </button>
                    )}
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCatEmoji}
                    onChange={(e) => setNewCatEmoji(e.target.value)}
                    className="w-12 bg-cream-soft border-none rounded-lg p-2 text-center text-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    maxLength={2}
                  />
                  <input
                    type="text"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="Category name"
                    className="flex-1 bg-cream-soft border-none rounded-lg p-2 text-sm font-medium text-espresso placeholder:text-coffee-muted/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    onClick={handleAddCategory}
                    className="bg-primary text-white px-4 rounded-lg font-bold text-sm"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}

            <div className="h-[1px] bg-primary/5 mx-4" />

            {/* Accounts */}
            <button
              onClick={() => setActiveSection(activeSection === "accounts" ? null : "accounts")}
              className="w-full flex items-center gap-4 px-4 py-4 hover:bg-primary/5 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Icon name="account_balance" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-espresso">Payment Accounts</p>
                <p className="text-xs text-coffee-muted">{accounts.length} accounts</p>
              </div>
              <Icon
                name={activeSection === "accounts" ? "expand_less" : "chevron_right"}
                className="text-coffee-muted/40"
              />
            </button>

            {activeSection === "accounts" && (
              <div className="px-4 pb-4 space-y-3 border-t border-cream-soft pt-3">
                {accounts.map((acc) => (
                  <div key={acc.id} className="flex items-center justify-between bg-cream-soft/50 rounded-xl px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <Icon name={acc.icon} size={20} className="text-coffee-muted" />
                      <span className="text-sm font-semibold text-espresso">{acc.name}</span>
                    </div>
                    <button onClick={() => handleDeleteAccount(acc.id)} className="text-danger/60 hover:text-danger">
                      <Icon name="delete_outline" size={20} />
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newAccName}
                    onChange={(e) => setNewAccName(e.target.value)}
                    placeholder="Account name"
                    className="flex-1 bg-cream-soft border-none rounded-lg p-2 text-sm font-medium text-espresso placeholder:text-coffee-muted/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    onClick={handleAddAccount}
                    className="bg-primary text-white px-4 rounded-lg font-bold text-sm"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}

            <div className="h-[1px] bg-primary/5 mx-4" />

            {/* Merchant Merging */}
            <button
              onClick={() => setActiveSection(activeSection === "merchants" ? null : "merchants")}
              className="w-full flex items-center gap-4 px-4 py-4 hover:bg-primary/5 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Icon name="merge" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-espresso">Merchant Merging</p>
                <p className="text-xs text-coffee-muted">Clean up duplicate names</p>
              </div>
              <Icon
                name={activeSection === "merchants" ? "expand_less" : "chevron_right"}
                className="text-coffee-muted/40"
              />
            </button>

            {activeSection === "merchants" && (
              <div className="px-4 pb-4 space-y-4 border-t border-cream-soft pt-3">
                {/* Existing aliases */}
                {Object.entries(aliases).length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-coffee-muted uppercase tracking-widest">Active Merges</p>
                    {Object.entries(aliases).map(([alias, canonical]) => (
                      <div key={alias} className="flex items-center justify-between bg-cream-soft/50 rounded-xl px-3 py-2.5">
                        <div className="text-sm">
                          <span className="text-coffee-muted line-through">{alias}</span>
                          <span className="text-coffee-muted mx-2">→</span>
                          <span className="font-semibold text-espresso">{canonical}</span>
                        </div>
                        <button onClick={() => handleRemoveAlias(alias)} className="text-danger/60 hover:text-danger">
                          <Icon name="close" size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Known merchants */}
                {merchants.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold text-coffee-muted uppercase tracking-widest mb-2">Your Merchants</p>
                    <div className="flex gap-1.5 flex-wrap">
                      {merchants.slice(0, 20).map((m, i) => (
                        <button
                          key={i}
                          onClick={() => setMergeFrom(m.merchant)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                            mergeFrom === m.merchant
                              ? "bg-primary/10 border-primary text-primary"
                              : "bg-cream-soft border-cream-deep text-coffee-deep"
                          }`}
                        >
                          {m.merchant}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Merge form */}
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-coffee-muted uppercase tracking-widest">New Merge</p>
                  <input
                    type="text"
                    value={mergeFrom}
                    onChange={(e) => setMergeFrom(e.target.value)}
                    placeholder="Original name (e.g. AMZN)"
                    className="w-full bg-cream-soft border-none rounded-lg p-2.5 text-sm font-medium text-espresso placeholder:text-coffee-muted/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <div className="flex items-center justify-center">
                    <Icon name="arrow_downward" size={18} className="text-coffee-muted/40" />
                  </div>
                  <input
                    type="text"
                    value={mergeTo}
                    onChange={(e) => setMergeTo(e.target.value)}
                    placeholder="Merge into (e.g. Amazon)"
                    className="w-full bg-cream-soft border-none rounded-lg p-2.5 text-sm font-medium text-espresso placeholder:text-coffee-muted/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    onClick={handleMerge}
                    className="w-full bg-primary text-white py-3 rounded-xl font-bold text-sm"
                  >
                    Merge Merchants
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Export */}
        <section className="pt-2">
          <button
            onClick={handleExport}
            className="w-full bg-espresso text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-espresso/20 active:scale-[0.98] transition-transform"
          >
            <Icon name="file_export" />
            Export CSV Data
          </button>
          <p className="text-center text-[11px] text-coffee-muted/60 mt-4 leading-relaxed px-8">
            Download your entire transaction history as a CSV file.
          </p>
        </section>

        {/* Footer */}
        <section className="text-center pt-6">
          <p className="text-xs text-coffee-muted/60 font-medium italic">Handcrafted for coffee lovers.</p>
          <p className="text-[10px] text-coffee-muted/30 mt-1 uppercase tracking-widest">
            Brewhisper v1.0.0
          </p>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
