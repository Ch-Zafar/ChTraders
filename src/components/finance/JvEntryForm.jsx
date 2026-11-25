"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, X, CheckCircle2, AlertCircle } from "lucide-react";
import AccountCombobox from "./AccountCombobox";
import { COA_DATA } from "./COA";

// Only active "Posting" accounts can be selected for journal entries
const GL_ACCOUNTS = COA_DATA.filter((acc) => acc.type === "Posting");

export default function JvEntryForm({ isOpen, onClose, onSubmit }) {
  // Today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  const [jvNo, setJvNo] = useState("JV-2026-007");
  const [date, setDate] = useState(today);

  // Initial account rows (starting with 2 rows as standard for double-entry)
  const [rows, setRows] = useState([
    {
      id: "row-1",
      accountHead: "1020 - Bank Account",
      narration: "Daily JV Voucher settlement",
      credit: 1000000,
      debit: "",
    },
    {
      id: "row-2",
      accountHead: "2010 - Accounts Payable — money you owe suppliers",
      narration: "Daily JV Voucher settlement",
      credit: "",
      debit: 1000000,
    },
  ]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Add a new row to the table
  const handleAddRow = () => {
    const newId = `row-${Date.now()}`;
    setRows([
      ...rows,
      { id: newId, accountHead: "", narration: "", credit: "", debit: "" },
    ]);
  };

  // Remove a row (ensure at least 2 rows remain)
  const handleRemoveRow = (id) => {
    if (rows.length <= 2) return;
    setRows(rows.filter((r) => r.id !== id));
  };

  // Update a specific field in a row
  const handleRowChange = (id, field, value) => {
    setRows((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;

        // If user enters a credit value, clear debit for that row (and vice versa)
        if (field === "credit" && value !== "") {
          return { ...row, credit: value, debit: "" };
        }
        if (field === "debit" && value !== "") {
          return { ...row, debit: value, credit: "" };
        }

        return { ...row, [field]: value };
      })
    );
  };

  // Calculate real-time totals
  const totalCredit = rows.reduce(
    (sum, r) => sum + (parseFloat(r.credit) || 0),
    0
  );
  const totalDebit = rows.reduce(
    (sum, r) => sum + (parseFloat(r.debit) || 0),
    0
  );
  const difference = Math.abs(totalDebit - totalCredit);
  const isBalanced = totalCredit > 0 && totalDebit > 0 && difference === 0;

  // Format currency display
  const formatNum = (num) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(num || 0);

  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isBalanced) {
      alert("Journal Voucher must be balanced before posting (Debit = Credit).");
      return;
    }

    const firstNarration =
      rows.find((r) => r.narration.trim() !== "")?.narration ||
      "Journal Voucher Entry";

    const newVoucher = {
      id: Date.now().toString(),
      Date: date,
      jvNo: jvNo,
      Narration: firstNarration,
      Debit: totalDebit,
      Credit: totalCredit,
      Status: "Posted",
      lines: rows,
    };

    onSubmit(newVoucher);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-ink/60 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      {/* Outer Modal Container */}
      <div className="relative w-full  bg-white border border-line rounded-xl shadow-2xl flex flex-col h-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-line bg-surface/30">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-accentsoft text-accent font-semibold border border-accent/20">
              FI-JV
            </span>
            <h1 className="text-sm font-semibold text-ink">
              Journal Voucher Entry Form
            </h1>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-inksoft hover:text-ink hover:bg-surface transition-colors"
            title="Close (Esc)"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Header Row: JV# on Left, Date on Right (Matching JV.png) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-surface/50 border border-line p-4 rounded-lg">
            {/* Left: JV# */}
            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold text-ink uppercase tracking-wide min-w-[45px]">
                JV#
              </label>
              <Input
                type="text"
                value={jvNo}
                onChange={(e) => setJvNo(e.target.value)}
                placeholder="e.g. JV-2026-007"
                className="font-mono text-xs bg-white border-line rounded-md h-9 max-w-xs focus:ring-1 focus:ring-accent"
                required
              />
            </div>

            {/* Right: Date */}
            <div className="flex items-center gap-3 sm:justify-end">
              <label className="text-xs font-semibold text-ink uppercase tracking-wide min-w-[45px]">
                Date
              </label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="font-mono text-xs bg-white border-line rounded-md h-9 max-w-xs focus:ring-1 focus:ring-accent"
                required
              />
            </div>
          </div>

          {/* Enclosed Account Card (Matching JV.png inner box) */}
          <div className="border border-line rounded-lg p-5 bg-white shadow-xs space-y-4">
            {/* Column Headers: Account Head (2), Narration (8), Credit (1), Debit (1) */}
            <div className="hidden sm:grid sm:grid-cols-12 gap-3 text-xs font-semibold text-inksoft uppercase tracking-wide px-2 pb-1 border-b border-line/60">
              <div className="col-span-2">Account Head *</div>
              <div className="col-span-8">Narration</div>
              <div className="col-span-1 text-right">Credit</div>
              <div className="col-span-1 text-right">Debit</div>
            </div>

            {/* Account Rows */}
            <div className="space-y-3">
              {rows.map((row, index) => (
                <div
                  key={row.id}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3 items-center p-2 rounded-md hover:bg-surface/40 transition-colors border sm:border-0 border-line"
                >
                  {/* Account Head Searchable Combobox (2 columns) */}
                  <div className="col-span-2">
                    <label className="block sm:hidden text-[11px] font-medium text-inksoft mb-1">
                      Account Head
                    </label>
                    <AccountCombobox
                      accounts={GL_ACCOUNTS}
                      value={row.accountHead}
                      onChange={(val) =>
                        handleRowChange(row.id, "accountHead", val)
                      }
                      placeholder="Select Account..."
                    />
                  </div>

                  {/* Narration (8 columns - remaining space) */}
                  <div className="col-span-8">
                    <label className="block sm:hidden text-[11px] font-medium text-inksoft mb-1">
                      Narration
                    </label>
                    <Input
                      type="text"
                      placeholder="Line item narration..."
                      value={row.narration}
                      onChange={(e) =>
                        handleRowChange(row.id, "narration", e.target.value)
                      }
                      className="text-xs h-9 bg-surface/70 border-line rounded-md"
                    />
                  </div>

                  {/* Credit Amount (1 column) */}
                  <div className="col-span-1">
                    <label className="block sm:hidden text-[11px] font-medium text-inksoft mb-1">
                      Credit
                    </label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      min="0"
                      step="any"
                      value={row.credit}
                      onChange={(e) =>
                        handleRowChange(row.id, "credit", e.target.value)
                      }
                      className="font-mono text-xs text-right h-9 px-1.5 bg-surface/70 border-line rounded-md"
                    />
                  </div>

                  {/* Debit Amount & Delete action (1 column) */}
                  <div className="col-span-1 flex items-center gap-1">
                    <div className="flex-1 min-w-0">
                      <label className="block sm:hidden text-[11px] font-medium text-inksoft mb-1">
                        Debit
                      </label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        min="0"
                        step="any"
                        value={row.debit}
                        onChange={(e) =>
                          handleRowChange(row.id, "debit", e.target.value)
                        }
                        className="font-mono text-xs text-right h-9 px-1.5 bg-surface/70 border-line rounded-md"
                      />
                    </div>

                    {/* Delete row action button */}
                    {rows.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveRow(row.id)}
                        className="p-1 text-inksoft hover:text-red hover:bg-redsoft rounded transition-colors shrink-0"
                        title="Remove row"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* "Add an account" Button (Matching JV.png) */}
            <div className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddRow}
                className="text-xs border-line text-ink hover:bg-surface font-medium flex items-center gap-1.5 h-8 px-3 rounded-md"
              >
                <Plus size={13} /> Add an account
              </Button>
            </div>
          </div>

          {/* Footer Totals Bar (Matching JV.png bottom enclosure) */}
          <div className="border border-line rounded-lg p-4 bg-surface/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Left: Total Label & Balance Status Indicator */}
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <span className="text-sm font-semibold text-ink">Total</span>

              {isBalanced ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-accentsoft text-accent border border-accent/20">
                  <CheckCircle2 size={13} /> Balanced ✓
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-ambersoft text-amber border border-amber/20">
                  <AlertCircle size={13} />
                  {totalCredit === 0 && totalDebit === 0
                    ? "Enter amounts to balance"
                    : `Difference: ${formatNum(difference)}`}
                </span>
              )}
            </div>

            {/* Right: Side-by-Side Boxes for Credit Total and Debit Total (Matching JV.png) */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              {/* Credit Total Box */}
              <div className="bg-white border border-line rounded-md px-4 py-2 min-w-[130px] text-right shadow-2xs">
                <div className="text-[10px] uppercase font-semibold text-inksoft tracking-wide">
                  Credit Total
                </div>
                <div className="font-mono text-sm font-semibold text-ink">
                  {formatNum(totalCredit)}
                </div>
              </div>

              {/* Debit Total Box */}
              <div className="bg-white border border-line rounded-md px-4 py-2 min-w-[130px] text-right shadow-2xs">
                <div className="text-[10px] uppercase font-semibold text-inksoft tracking-wide">
                  Debit Total
                </div>
                <div className="font-mono text-sm font-semibold text-ink">
                  {formatNum(totalDebit)}
                </div>
              </div>
            </div>
          </div>

          {/* Modal Actions Footer */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-line text-ink hover:bg-surface text-xs h-9 px-4 rounded-md"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isBalanced}
              className="bg-accent text-white hover:bg-accent/90 disabled:opacity-50 text-xs font-medium h-9 px-5 rounded-md shadow-xs transition-colors"
            >
              Save as Draft
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
