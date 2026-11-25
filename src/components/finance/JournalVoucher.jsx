"use client";

import * as React from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Plus } from "lucide-react";
import JvEntryForm from "./JvEntryForm";

export default function JournalVoucher() {
  const [isFormOpen, setIsFormOpen] = React.useState(false);

  // Initial Sample JV records
  const [jvData, setJvData] = React.useState([
    {
      id: "1",
      Date: "2026-11-29",
      jvNo: "JV-2026-001",
      Narration: "Daily JV Voucher - Inter-branch settlement",
      Debit: 1000000,
      Credit: 1000000,
      Status: "Posted",
    },
    {
      id: "2",
      Date: "2026-11-28",
      jvNo: "JV-2026-002",
      Narration: "Raw materials procurement adjustment",
      Debit: 450000,
      Credit: 450000,
      Status: "Posted",
    },
    {
      id: "3",
      Date: "2026-11-27",
      jvNo: "JV-2026-003",
      Narration: "Monthly warehouse lease pre-payment amortization",
      Debit: 85000,
      Credit: 85000,
      Status: "Approved",
    },
    {
      id: "4",
      Date: "2026-11-26",
      jvNo: "JV-2026-004",
      Narration: "Freight transportation loading charge settlement",
      Debit: 120000,
      Credit: 120000,
      Status: "In Process",
    },
    {
      id: "5",
      Date: "2026-11-25",
      jvNo: "JV-2026-005",
      Narration: "Payroll tax accrual and withholding transfer",
      Debit: 620000,
      Credit: 620000,
      Status: "Posted",
    },
    {
      id: "6",
      Date: "2026-11-24",
      jvNo: "JV-2026-006",
      Narration: "Equipment depreciation entry for Q4",
      Debit: 310000,
      Credit: 310000,
      Status: "Approved",
    },
  ]);

  // Handle new voucher submission from form
  const handleCreateVoucher = (newVoucher) => {
    setJvData((prev) => [newVoucher, ...prev]);
  };

  // Number formatter for tabular currency
  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val || 0);

  // Column definitions for TanStack Table
  const columns = [
    {
      accessorKey: "Date",
      header: ({ column }) => (
        <button
          type="button"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1 hover:text-ink transition-colors cursor-pointer"
        >
          DATE
          <ArrowUpDown size={12} className="text-inksoft" />
        </button>
      ),
      cell: ({ row }) => (
        <span className="font-mono text-xs text-inksoft">
          {row.getValue("Date")}
        </span>
      ),
    },
    {
      accessorKey: "jvNo",
      header: "JV#",
      cell: ({ row }) => (
        <span className="font-mono text-xs font-semibold text-accent">
          {row.getValue("jvNo")}
        </span>
      ),
    },
    {
      accessorKey: "Narration",
      header: "NARRATION",
      cell: ({ row }) => (
        <span className="font-medium text-ink">
          {row.getValue("Narration")}
        </span>
      ),
    },
    {
      accessorKey: "Debit",
      header: () => <div className="text-right">DEBIT</div>,
      cell: ({ row }) => (
        <div className="font-mono text-xs text-right text-ink font-medium">
          {formatCurrency(row.getValue("Debit"))}
        </div>
      ),
    },
    {
      accessorKey: "Credit",
      header: () => <div className="text-right">CREDIT</div>,
      cell: ({ row }) => (
        <div className="font-mono text-xs text-right text-ink font-medium">
          {formatCurrency(row.getValue("Credit"))}
        </div>
      ),
    },
    {
      accessorKey: "Status",
      header: "STATUS",
      cell: ({ row }) => {
        const status = row.getValue("Status");
        const badgeClasses =
          status === "Posted"
            ? "bg-accentsoft text-accent"
            : status === "Approved"
            ? "bg-accentsoft text-accent"
            : "bg-ambersoft text-amber";

        return (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${badgeClasses}`}
          >
            {status}
          </span>
        );
      },
    },
  ];

  return (
    <div className="bg-white border border-line rounded-md p-6">
      {/* Top Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-line mb-5 gap-3">
        <div>
          <h2 className="text-sm font-semibold text-ink">Journal Vouchers (JV)</h2>
          <p className="text-xs text-inksoft mt-0.5">
            Multi-line debit and credit vouchers for adjustments, settlements, and transfers.
          </p>
        </div>

        {/* Trigger Button to open JV Entry Modal */}
        <Button
          size="sm"
          onClick={() => setIsFormOpen(true)}
          className="bg-accent text-white hover:bg-accent/90 text-xs font-medium flex items-center gap-1.5 h-8 px-3 rounded-md shadow-xs cursor-pointer"
        >
          <Plus size={14} /> New Journal Voucher
        </Button>
      </div>

      {/* TanStack Data Table with Search, Sort, and Pagination */}
      <DataTable
        columns={columns}
        data={jvData}
        searchKey="Narration"
        searchPlaceholder="Filter by narration..."
      />

      {/* Pop-up JV Entry Form (Inspiration: context/Inspiration/JV.png) */}
      <JvEntryForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateVoucher}
      />
    </div>
  );
}
