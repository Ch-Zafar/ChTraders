"use client";

import React, { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Plus, FolderTree, BookOpen } from "lucide-react";

// Official COA Structure provided by user
export const COA_DATA = [
  { code: "1000", name: "Assets", type: "Group", category: "Assets" },
  { code: "1010", name: "Cash in Hand", type: "Posting", category: "Assets" },
  { code: "1020", name: "Bank Account", type: "Posting", category: "Assets" },
  { code: "1030", name: "Accounts Receivable — money customers owe you", type: "Posting", category: "Assets" },
  { code: "1040", name: "Prepaid Expenses", type: "Posting", category: "Assets" },
  { code: "1050", name: "Computers & Equipment", type: "Posting", category: "Assets" },
  { code: "1060", name: "Accumulated Depreciation — Equipment", type: "Posting", category: "Assets" },
  { code: "2000", name: "Liabilities", type: "Group", category: "Liabilities" },
  { code: "2010", name: "Accounts Payable — money you owe suppliers", type: "Posting", category: "Liabilities" },
  { code: "2020", name: "Salaries Payable", type: "Posting", category: "Liabilities" },
  { code: "2030", name: "Taxes Payable", type: "Posting", category: "Liabilities" },
  { code: "2040", name: "Loans Payable", type: "Posting", category: "Liabilities" },
  { code: "2050", name: "Customer Advances / Unearned Revenue", type: "Posting", category: "Liabilities" },
  { code: "3000", name: "Equity", type: "Group", category: "Equity" },
  { code: "3010", name: "Owner’s Capital", type: "Posting", category: "Equity" },
  { code: "3020", name: "Owner’s Drawings", type: "Posting", category: "Equity" },
  { code: "3030", name: "Retained Earnings", type: "Posting", category: "Equity" },
  { code: "4000", name: "Revenue", type: "Group", category: "Revenue" },
  { code: "4010", name: "Service Revenue", type: "Posting", category: "Revenue" },
  { code: "4020", name: "Other Income", type: "Posting", category: "Revenue" },
  { code: "5000", name: "Expenses", type: "Group", category: "Expenses" },
  { code: "5010", name: "Salaries Expense", type: "Posting", category: "Expenses" },
  { code: "5020", name: "Rent Expense", type: "Posting", category: "Expenses" },
  { code: "5030", name: "Electricity & Utilities Expense", type: "Posting", category: "Expenses" },
  { code: "5040", name: "Internet & Telephone Expense", type: "Posting", category: "Expenses" },
  { code: "5050", name: "Software & Subscriptions Expense", type: "Posting", category: "Expenses" },
  { code: "5060", name: "Office Supplies Expense", type: "Posting", category: "Expenses" },
  { code: "5070", name: "Marketing & Advertising Expense", type: "Posting", category: "Expenses" },
  { code: "5080", name: "Bank Charges", type: "Posting", category: "Expenses" },
  { code: "5090", name: "Depreciation Expense", type: "Posting", category: "Expenses" },
  { code: "5100", name: "Interest Expense", type: "Posting", category: "Expenses" },
];

export default function COA() {
  const [data, setData] = useState(COA_DATA);

  // Column definitions for TanStack DataTable
  const columns = [
    {
      accessorKey: "code",
      header: ({ column }) => (
        <button
          type="button"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1 hover:text-ink transition-colors cursor-pointer"
        >
          CODE
          <ArrowUpDown size={12} className="text-inksoft" />
        </button>
      ),
      cell: ({ row }) => {
        const isGroup = row.original.type === "Group";
        return (
          <span
            className={`font-mono text-xs ${isGroup ? "font-bold text-ink" : "text-accent font-semibold"
              }`}
          >
            {row.getValue("code")}
          </span>
        );
      },
    },
    {
      accessorKey: "name",
      header: "ACCOUNT HEAD",
      cell: ({ row }) => {
        const isGroup = row.original.type === "Group";
        return (
          <div
            className={`flex items-center gap-2 ${isGroup ? "font-semibold text-ink uppercase tracking-wide text-xs" : "text-ink font-medium pl-3"
              }`}
          >
            {isGroup ? (
              <FolderTree size={14} className="text-accent shrink-0" />
            ) : (
              <span className="text-inksoft/40">•</span>
            )}
            <span className="truncate">{row.getValue("name")}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "category",
      header: "CATEGORY",
      cell: ({ row }) => (
        <span className="text-xs text-inksoft font-medium">
          {row.getValue("category")}
        </span>
      ),
    },
    {
      accessorKey: "type",
      header: "TYPE",
      cell: ({ row }) => {
        const type = row.getValue("type");
        const isGroup = type === "Group";

        return (
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium whitespace-nowrap ${isGroup
              ? "bg-surface text-inksoft border border-line font-semibold"
              : "bg-accentsoft text-accent"
              }`}
          >
            {isGroup ? <FolderTree size={11} /> : <BookOpen size={11} />}
            {type}
          </span>
        );
      },
    },
  ];

  return (
    <div className="bg-white border border-line rounded-md p-6">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-line mb-5 gap-3">
        <div>
          <h2 className="text-sm font-semibold text-ink">Chart of Accounts (COA)</h2>
          <p className="text-xs text-inksoft mt-0.5">
            Master list of general ledger account heads, category groups, and active posting accounts.
          </p>
        </div>

        <Button
          size="sm"
          className="bg-accent text-white hover:bg-accent/90 text-xs font-medium flex items-center gap-1.5 h-8 px-3 rounded-md shadow-xs cursor-pointer"
        >
          <Plus size={14} /> Add Account Head
        </Button>
      </div>

      {/* TanStack Data Table with Search and Sort (Pagination disabled) */}
      <DataTable
        columns={columns}
        data={data}
        searchKey="name"
        searchPlaceholder="Search account head or code..."
        showPagination={false}
      />
    </div>
  );
}
