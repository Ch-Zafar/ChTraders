"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

export function DataTable({
  columns,
  data,
  searchKey = "narration",
  searchPlaceholder = "Search records...",
  showPagination = true,
  pageSize = 5,
  toolbarFilter = null,
}) {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: showPagination ? pageSize : 1000,
      },
    },
  });

  const selectedCount = Object.keys(rowSelection).length;

  return (
    <div className="space-y-4">
      {/* Table Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick Search */}
          <div className="relative w-64 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-inksoft size-3.5" />
            <Input
              placeholder={searchPlaceholder}
              value={table.getColumn(searchKey)?.getFilterValue() ?? ""}
              onChange={(event) =>
                table.getColumn(searchKey)?.setFilterValue(event.target.value)
              }
              className="pl-8 text-xs h-8 bg-surface border-line rounded-md"
            />
          </div>

          {/* Optional Toolbar Filters (e.g. Account Head Select dropdown) */}
          {toolbarFilter}
        </div>

        {/* Counter and Selection Status */}
        <div className="text-xs text-inksoft font-mono flex items-center gap-2">
          {selectedCount > 0 && (
            <span className="text-accent bg-accentsoft font-semibold px-2 py-0.5 rounded text-[11px] border border-accent/20">
              {selectedCount} of {table.getFilteredRowModel().rows.length} selected
            </span>
          )}
          <span>
            Total: {table.getFilteredRowModel().rows.length} records
          </span>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-md border border-line bg-white overflow-hidden shadow-2xs">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-surface/60 hover:bg-surface/60 border-b border-line"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-xs font-semibold text-inksoft uppercase tracking-wide px-4 py-2.5"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={`transition-colors border-b border-line last:border-0 ${row.getIsSelected()
                    ? "bg-accentsoft/30 hover:bg-accentsoft/40"
                    : "hover:bg-surface/60"
                    }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-4 py-2.5 text-sm text-ink"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-xs text-inksoft"
                >
                  No records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls (if enabled) */}
      {showPagination && (
        <div className="flex items-center justify-between text-xs text-inksoft px-1">
          <div>
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount() || 1}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-7 text-xs gap-1 border-line text-ink hover:bg-surface"
            >
              <ChevronLeft size={13} /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-7 text-xs gap-1 border-line text-ink hover:bg-surface"
            >
              Next <ChevronRight size={13} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
