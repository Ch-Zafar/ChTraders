"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import COA from "@/components/finance/COA";
import GeneralLedger from "@/components/finance/GeneralLedger";
import JournalVoucher from "@/components/finance/JournalVoucher";

export default function FinancialAccountingPage() {
  return (
    <div>
      {/* Module Header Block (DESIGN.md Section 5.1) */}
      <div className="mb-5">
        <h1 className="text-lg font-semibold text-ink">Financial Accounting</h1>
        <p className="text-sm text-inksoft mt-1">
          General ledger accounts, customer and vendor invoicing.
        </p>
      </div>

      {/* Tabs Navigation using shadcn Tabs with ERP line styling */}
      <Tabs defaultValue="coa" className="w-full">
        <TabsList variant="line" className="mb-6">
          <TabsTrigger value="coa">COA</TabsTrigger>
          <TabsTrigger value="ledger">General Ledgers</TabsTrigger>
          <TabsTrigger value="jv">Journal Voucher</TabsTrigger>
        </TabsList>

        <TabsContent value="coa">
          <COA />
        </TabsContent>

        <TabsContent value="ledger">
          <GeneralLedger />
        </TabsContent>

        <TabsContent value="jv">
          <JournalVoucher />
        </TabsContent>
      </Tabs>
    </div>
  );
}
