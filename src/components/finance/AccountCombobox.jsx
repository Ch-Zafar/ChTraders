"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Check } from "lucide-react";

export default function AccountCombobox({
  accounts = [],
  value,
  onChange,
  placeholder = "Select Account Head...",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Auto-focus the search input when opened
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
      return () => {
        clearTimeout(timer);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  // Filter accounts by code or name
  const filteredAccounts = accounts.filter((acc) => {
    const query = searchQuery.toLowerCase().trim();
    return (
      acc.code.toLowerCase().includes(query) ||
      acc.name.toLowerCase().includes(query)
    );
  });

  // Find the selected account object to display its label
  const selectedAccount = accounts.find(
    (acc) => `${acc.code} - ${acc.name}` === value || acc.code === value
  );

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Trigger Button - White background */}
      <button
        type="button"
        onClick={() => {
          setIsOpen((prev) => !prev);
          setSearchQuery("");
        }}
        className="w-full text-xs h-9 px-2.5 bg-white border border-line rounded-md flex items-center justify-between text-ink hover:border-inksoft/50 transition-colors focus:outline-none focus:ring-1 focus:ring-accent cursor-pointer shadow-2xs"
      >
        <span className="truncate text-left font-mono">
          {selectedAccount ? (
            <span className="text-ink font-medium">
              <span className="text-accent font-semibold">{selectedAccount.code}</span> · {selectedAccount.name}
            </span>
          ) : (
            <span className="text-inksoft font-sans">{placeholder}</span>
          )}
        </span>
        <ChevronDown size={14} className="text-inksoft shrink-0 ml-1" />
      </button>

      {/* White Pop-up Dropdown with Search */}
      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-1 w-72 sm:w-80 bg-white border border-line rounded-lg shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-100">
          {/* Live Search Input Bar */}
          <div className="p-2 border-b border-line bg-white flex items-center gap-2">
            <Search size={13} className="text-inksoft shrink-0 ml-1" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search code or account title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs py-1 px-1 bg-white border-0 outline-none text-ink placeholder:text-inksoft/70"
            />
          </div>

          {/* Scrollable Filtered List */}
          <div className="max-h-52 overflow-y-auto py-1 divide-y divide-line/40 bg-white">
            {filteredAccounts.length > 0 ? (
              filteredAccounts.map((acc) => {
                const accValue = `${acc.code} - ${acc.name}`;
                const isSelected = value === accValue;

                return (
                  <div
                    key={acc.code}
                    onClick={() => {
                      onChange(accValue);
                      setIsOpen(false);
                    }}
                    className={`px-3 py-2 text-xs flex items-center justify-between cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-accentsoft text-accent font-medium"
                        : "hover:bg-surface text-ink"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono text-[11px] font-semibold text-accent shrink-0">
                        {acc.code}
                      </span>
                      <span className="truncate text-ink">{acc.name}</span>
                    </div>
                    {isSelected && (
                      <Check size={13} className="shrink-0 text-accent" />
                    )}
                  </div>
                );
              })
            ) : (
              <div className="px-3 py-4 text-xs text-center text-inksoft">
                No matching account found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
