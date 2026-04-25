"use client";

import { useState } from "react";
import { useMyContext } from "@/useContext/myContext";

const FIELD =
  "w-full bg-stone-50 border border-stone-200 rounded-sm px-3 py-2.5 font-mono text-[12px] text-stone-800 placeholder:text-stone-300 focus:outline-none focus:border-stone-500 focus:bg-white transition-colors duration-150";
const LABEL =
  "block font-mono text-[10px] uppercase tracking-widest text-stone-400 mb-1.5";
const OPTIONAL_BADGE =
  "ml-2 font-mono text-[9px] text-stone-300 normal-case tracking-normal";

export function AddTransaction({ onClose, onSuccess }) {
  const { user } = useMyContext();

  const [form, setForm] = useState({
    title: "",
    amount: "",
    transaction_type: "EXPENSE",
    timestamp: new Date().toISOString().slice(0, 16),
    notes: "",
    merchant_id: "",
    category_id: "",
    source: "",
    attachments: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleFiles(e) {
    const names = Array.from(e.target.files).map((f) => f.name);
    update("attachments", names);
  }

  async function handleSubmit() {
    setError("");

    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    if (
      !form.amount ||
      isNaN(Number(form.amount)) ||
      Number(form.amount) <= 0
    ) {
      setError("Enter a valid amount.");
      return;
    }
    if (!form.timestamp) {
      setError("Timestamp is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("access_token");
      const payload = {
        user_id: user.userId,
        title: form.title.trim(),
        amount: parseFloat(form.amount),
        transaction_type: form.transaction_type,
        timestamp: new Date(form.timestamp).toISOString(),
        notes: form.notes.trim() || null,
        merchant_id: form.merchant_id.trim() || null,
        category_id: form.category_id.trim() || null,
        source: form.source.trim() || null,
        attachments: form.attachments.length ? form.attachments : null,
      };

      // replace with your actual API call
      console.log("Submitting:", payload, token);

      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to add transaction.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 backdrop-blur-[2px] p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Panel */}
      <div className="relative w-full max-w-5xl bg-stone-100 border border-stone-200 border-t-4 border-t-stone-900 rounded-sm shadow-2xl overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-stone-100">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-stone-400">
              New Entry
            </p>
            <h2 className="font-mono text-[18px] font-bold text-stone-900 tracking-tight mt-0.5">
              Add Transaction
            </h2>
          </div>

          {/* Type toggle — INCOME / EXPENSE */}
          <div className="flex items-center border border-stone-200 rounded-sm overflow-hidden">
            {["EXPENSE", "INCOME"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => update("transaction_type", t)}
                className={`
                  px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest
                  transition-colors duration-150
                  ${
                    form.transaction_type === t
                      ? t === "EXPENSE"
                        ? "bg-stone-900 text-amber-50"
                        : "bg-amber-700 text-amber-50"
                      : "bg-white text-stone-400 hover:text-stone-700"
                  }
                `}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Form body */}
        <div className="px-6 py-5 flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
          {/* Row 1: Title + Amount */}
          <div className="grid grid-cols-[1fr_auto] gap-3 items-end">
            <div>
              <label className={LABEL}>Title</label>
              <input
                type="text"
                placeholder="e.g. Groceries at DMart"
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                className={FIELD}
              />
            </div>
            <div className="w-32">
              <label className={LABEL}>Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[11px] text-stone-400">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={(e) => update("amount", e.target.value)}
                  className={`${FIELD} pl-6`}
                />
              </div>
            </div>
          </div>

          {/* Row 2: Timestamp */}
          <div>
            <label className={LABEL}>Date & Time</label>
            <input
              type="datetime-local"
              value={form.timestamp}
              onChange={(e) => update("timestamp", e.target.value)}
              className={FIELD}
            />
          </div>

          {/* Row 3: Merchant + Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>
                Merchant <span className={OPTIONAL_BADGE}>optional</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Swiggy"
                value={form.merchant_id}
                onChange={(e) => update("merchant_id", e.target.value)}
                className={FIELD}
              />
            </div>
            <div>
              <label className={LABEL}>
                Category <span className={OPTIONAL_BADGE}>optional</span>
              </label>
              <input
                type="text"
                placeholder="e.g. food"
                value={form.category_id}
                onChange={(e) => update("category_id", e.target.value)}
                className={FIELD}
              />
            </div>
          </div>

          {/* Row 4: Source */}
          <div>
            <label className={LABEL}>
              Source <span className={OPTIONAL_BADGE}>optional</span>
            </label>
            <input
              type="text"
              placeholder="e.g. UPI, Cash, Credit Card"
              value={form.source}
              onChange={(e) => update("source", e.target.value)}
              className={FIELD}
            />
          </div>

          {/* Row 5: Notes */}
          <div>
            <label className={LABEL}>
              Notes <span className={OPTIONAL_BADGE}>optional</span>
            </label>
            <textarea
              rows={2}
              placeholder="Any additional context..."
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              className={`${FIELD} resize-none`}
            />
          </div>

          {/* Row 6: Attachments */}
          <div>
            <label className={LABEL}>
              Attachments <span className={OPTIONAL_BADGE}>optional</span>
            </label>
            <label className="flex items-center gap-3 w-full bg-stone-50 border border-dashed border-stone-300 rounded-sm px-3 py-2.5 cursor-pointer hover:border-stone-400 hover:bg-white transition-colors duration-150">
              <span className="font-mono text-[11px] text-stone-400">
                {form.attachments.length
                  ? form.attachments.join(", ")
                  : "Click to upload files"}
              </span>
              <input
                type="file"
                multiple
                className="hidden"
                onChange={handleFiles}
              />
            </label>
          </div>

          {error && (
            <div className="border border-red-200 bg-red-50 rounded-sm px-3 py-2 font-mono text-[11px] text-red-700">
              {error}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-stone-100 bg-white">
          <button
            type="button"
            onClick={onClose}
            className="font-mono text-[11px] uppercase tracking-widest text-stone-400 hover:text-stone-700 transition-colors duration-150"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-amber-50 font-mono text-[11px] font-bold uppercase tracking-widest rounded-sm border border-stone-800 hover:bg-stone-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
          >
            <span className="text-amber-400 text-base leading-none">+</span>
            {isSubmitting ? "Saving..." : "Save Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
}
