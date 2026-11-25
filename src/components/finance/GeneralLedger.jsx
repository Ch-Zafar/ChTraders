"use client";

import React, { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Download } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

// Realistic General Ledger transaction records referencing the COA
const GL_TRANSACTIONS = [
  {
    id: "gl-1",
    date: "2026-11-29",
    jvNo: "1020",
    account: "1020 · Bank Account",
    debit: 1000000,
    credit: 0,
    balance: 1000000,
  },
  {
    id: "gl-2",
    date: "2026-11-29",
    jvNo: "4010",
    account: "4010 · Service Revenue",
    debit: 0,
    credit: 1000000,
    balance: 1000000,
  },
  {
    id: "gl-3",
    date: "2026-11-28",
    jvNo: "2010",
    account: "2010 · Accounts Payable — money you owe suppliers",
    debit: 450000,
    credit: 0,
    balance: 550000,
  },
  {
    id: "gl-4",
    date: "2026-11-28",
    jvNo: "1020",
    account: "1020 · Bank Account",
    debit: 0,
    credit: 450000,
    balance: 550000,
  },
  {
    id: "gl-5",
    date: "2026-11-27",
    jvNo: "5020",
    account: "5020 · Rent Expense",
    debit: 85000,
    credit: 0,
    balance: 465000,
  },
  {
    id: "gl-6",
    date: "2026-11-27",
    jvNo: "1020",
    account: "1020 · Bank Account",
    debit: 0,
    credit: 85000,
    balance: 465000,
  },
  {
    id: "gl-7",
    date: "2026-11-26",
    jvNo: "5010",
    account: "5010 · Salaries Expense",
    debit: 320000,
    credit: 0,
    balance: 145000,
  },
  {
    id: "gl-8",
    date: "2026-11-26",
    jvNo: "1010",
    account: "1010 · Cash in Hand",
    debit: 25000,
    credit: 0,
    balance: 120000,
  },
  {
    id: "gl-9",
    date: "2026-11-25",
    jvNo: "5030",
    account: "5030 · Electricity & Utilities Expense",
    debit: 48000,
    credit: 0,
    balance: 72000,
  },
  {
    id: "gl-10",
    date: "2026-11-25",
    jvNo: "1020",
    account: "1020 · Bank Account",
    debit: 0,
    credit: 48000,
    balance: 72000,
  },
];

export default function GeneralLedger() {
  const [transactions, setTransactions] = useState(GL_TRANSACTIONS);

  // Currency formatter
  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val || 0);

  // Column definitions for TanStack DataTable
  const columns = [
    // 1. Select Checkbox Column (Default white background)
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center px-1">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all rows"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center px-1">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },

    // 2. Date Column
    {
      accessorKey: "date",
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
          {row.getValue("date")}
        </span>
      ),
    },

    // 3. ACC Code Column
    {
      accessorKey: "jvNo",
      header: "ACC Code",
      cell: ({ row }) => (
        <span className="font-mono text-xs font-semibold text-accent">
          {row.getValue("jvNo")}
        </span>
      ),
    },

    // 4. Account Head Column
    {
      accessorKey: "account",
      header: "ACCOUNT HEAD",
      cell: ({ row }) => (
        <span className="font-medium text-xs text-ink">
          {row.getValue("account")}
        </span>
      ),
    },

    // 5. Total Debit Column
    {
      accessorKey: "debit",
      header: () => <div className="text-right">Total DEBIT</div>,
      cell: ({ row }) => {
        const val = row.getValue("debit");
        return (
          <div className="font-mono text-xs text-right text-ink font-medium">
            {val > 0 ? formatCurrency(val) : "—"}
          </div>
        );
      },
    },

    // 6. Total Credit Column
    {
      accessorKey: "credit",
      header: () => <div className="text-right">Total CREDIT</div>,
      cell: ({ row }) => {
        const val = row.getValue("credit");
        return (
          <div className="font-mono text-xs text-right text-ink font-medium">
            {val > 0 ? formatCurrency(val) : "—"}
          </div>
        );
      },
    },

    // 7. Running Balance Column
    {
      accessorKey: "balance",
      header: () => <div className="text-right">RUNNING BAL</div>,
      cell: ({ row }) => (
        <div className="font-mono text-xs text-right text-ink font-semibold">
          {formatCurrency(row.getValue("balance"))}
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white border border-line rounded-md p-6">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-line mb-5 gap-3">
        <div>
          <h2 className="text-sm font-semibold text-ink">General Ledger (GL)</h2>
          <p className="text-xs text-inksoft mt-0.5">
            Complete transaction ledger audit trail with debits, credits, and running account balances.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-line text-ink hover:bg-surface text-xs font-medium flex items-center gap-1.5 h-8 px-3 rounded-md cursor-pointer"
          >
            <Download size={13} /> Export GL
          </Button>
        </div>
      </div>

      {/* TanStack Data Table with Row Selection (Pagination disabled) */}
      <DataTable
        columns={columns}
        data={transactions}
        searchKey="account"
        searchPlaceholder="Search account head..."
        showPagination={false}
      />
    </div>
  );
}
