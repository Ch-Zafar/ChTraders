# Meridian ERP — Design System & UI Specifications

This document defines the visual design system, UI architecture, component patterns, and styling rules for **Meridian ERP**. All new pages, components, and modifications must strictly follow these rules to maintain visual and functional consistency across the entire application.

---

## 1. Design Philosophy & Aesthetic

Meridian ERP follows a **utilitarian enterprise design language** modeled after classic SAP and modern industrial ERP software:
- **High Information Density**: Compact padding, tight typography, and tabular alignments designed for operational workflows.
- **Subdued & Professional Palette**: Deep navy ink, clean off-white surfaces, and focused teal accenting. Color is used purposefully for status, data visualization, and primary actions—never purely decorative.
- **Precision Data Presentation**: Monospaced tabular numerals for financial figures, codes, IDs, and dates.
- **Component Reusability**: All entity management views share a unified structure (`Shell` → `Module Header` → `Tabs` → `ModulePanel` → `Table` / `Modal Form`).

---

## 2. Design Tokens & Color Palette

All colors are exposed as CSS variables in `src/app/globals.css` and mapped into `tailwind.config.js`.

| Token | CSS Variable | Hex Value | Tailwind Utility | Semantic Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Ink** | `--ink` | `#10192e` | `text-ink`, `bg-ink` | Primary text, headings, dark sidebar background |
| **Ink Soft** | `--ink-soft` | `#5b6472` | `text-inksoft` | Secondary labels, table headers, metadata, chart labels |
| **Surface** | `--surface` | `#f3f5f8` | `bg-surface` | App background canvas, input fields, subtle hover states |
| **Border / Line** | `--border` | `#dfe3ea` | `border-line` | Card borders, dividers, table row lines, chart grids |
| **Accent** | `--accent` | `#0f7a72` | `text-accent`, `bg-accent` | Primary brand color, primary CTA buttons, active tabs/nav |
| **Accent Soft** | `--accent-soft` | `#e4f3f1` | `bg-accentsoft` | Positive/active badge backgrounds, avatar background |
| **Amber** | `--amber` | `#b5790a` | `text-amber` | Pending, in-progress, warning states and KPI highlights |
| **Amber Soft** | `--amber-soft` | `#fbf1de` | `bg-ambersoft` | In-progress/pending badge backgrounds |
| **Red** | `--red` | `#b3261e` | `text-red`, `hover:text-red` | Critical/overdue states, destructive actions, required asterisks |
| **Red Soft** | `--red-soft` | `#fbe9e8` | `bg-redsoft` | Overdue / alert badge backgrounds |
| **White** | — | `#ffffff` | `bg-white`, `text-white` | Card backgrounds, modal windows, table surface, header |

---

## 3. Typography & Monospace Rules

### Font Families
- **Sans-serif (Primary UI)**: `Segoe UI`, `ui-sans-serif`, `system-ui`, `-apple-system`, `Helvetica Neue`, `Arial`, `sans-serif`
- **Monospace (Data & Codes)**: `SFMono-Regular`, `Consolas`, `Liberation Mono`, `Menlo`, `ui-monospace`, `monospace`

### Hierarchy & Text Sizes
| Element | Tailwind Classes | Usage Example |
| :--- | :--- | :--- |
| **Module Page Title** | `text-lg font-semibold text-ink` | `Financial Accounting` |
| **Module Page Subtitle** | `text-sm text-inksoft mt-1` | `General ledger accounts, customer and vendor invoicing.` |
| **Card / Panel Heading** | `text-sm font-semibold text-ink` | `Chart of Accounts`, `Sales Orders` |
| **Table Column Header** | `text-xs font-medium text-inksoft uppercase tracking-wide` | `ACCOUNT NO`, `AMOUNT` |
| **Table Body Text** | `text-sm text-ink` | Standard table cell data |
| **Table Monospace Cell** | `font-mono text-xs` | Document numbers, IDs, dates (`docNo`, `2026-03-31`) |
| **KPI Big Value** | `text-2xl font-semibold font-mono` | `$1,245,000`, `18` |
| **Form Field Label** | `text-xs font-medium text-inksoft` | `Account Number *` |
| **Status Badge Text** | `text-xs font-medium` | `Cleared`, `In Process`, `Loaded`, `In Transit`, `Overdue` |
| **System Code Tag** | `text-[10px] font-mono text-white/30` | `FI`, `SD`, `MM`, `PP`, `TM`, `HCM` |

### Tabular Numbers Rule
For all monetary values, quantities, and dates, enable tabular numerals using `.mono` or `font-mono` so numbers align neatly across table rows:
```css
.mono {
  font-variant-numeric: tabular-nums;
}
```

---

## 4. Layout Architecture & App Shell

The entire application is wrapped by `Shell.jsx` within `src/app/layout.jsx`.

```
+-----------------------------------------------------------------------------------+
|  SIDEBAR (w-64 bg-ink)               TOP HEADER (h-14 bg-white border-b)          |
|  +-----------------------------+     +-----------------------------------------+  |
|  | Meridian  ERP 6.0           |     | FI / Financial Accounting  [Search] (JS)|  |
|  | Enterprise Resource Plan... |     +-----------------------------------------+  |
|  +-----------------------------+     MAIN CONTENT (p-6 bg-surface overflow-auto)|
|  | [Icon] Dashboard        OV  |     +-----------------------------------------+  |
|  | [Icon] Financial Acct   FI  |     | Page Header: Title + Subtitle           |  |
|  | [Icon] Sales & Dist     SD  |     | Tabs: [Tab 1] [Tab 2]                   |  |
|  | [Icon] Materials Mgmt   MM  |     | Data Panel: [Filter] [+ New Record]     |  |
|  | [Icon] Production Pln   PP  |     | Table / Grid / KPI Cards                |  |
|  | [Icon] Transportation   TM  |     +-----------------------------------------+  |
|  | [Icon] Human Capital    HCM |                                                  |
|  +-----------------------------+                                                  |
|  | Client 100 · System PRD     |                                                  |
+-----------------------------------------------------------------------------------+
```

### 1. Fixed & Toggleable Sidebar (`<aside className="fixed top-0 bottom-0 left-0 z-40 w-64 bg-ink text-white flex flex-col">`)
- **Fixed Positioning**: Pinned to the left viewport edge (`fixed top-0 bottom-0 left-0 h-screen`), remaining accessible during vertical scrolling.
- **Toggle State**: Smoothly hides and unhides via `transition-transform duration-200` (`translate-x-0` when open, `-translate-x-full` when hidden).
- **Brand Header**: `px-5 py-5 border-b border-white/10 flex items-center justify-between`. Shows "Meridian ERP 6.0" and a hide button (`PanelLeftClose`).
- **Nav Links**:
  - Regular state: `px-5 py-2.5 text-sm border-l-2 border-transparent text-white/60 hover:text-white hover:bg-white/[0.04]`
  - Active state: `bg-white/[0.07] border-accent text-white`
  - Icons: Lucide icon, `size={17}`, `strokeWidth={1.75}`
  - SAP Module Code: Right-aligned badge `text-[10px] font-mono text-white/30`
- **Footer**: `px-5 py-4 border-t border-white/10 text-[11px] text-white/40 font-mono` displaying system status (`Client 100 · System PRD`).
- **Preference Persistence**: Preserves hide/show state in `localStorage` across page reloads.

### 2. Sticky Header (`<header className="h-14 shrink-0 bg-white border-b border-line flex items-center justify-between px-6 sticky top-0 z-20">`)
- **Sidebar Toggle Button**: Left-aligned icon button (`PanelLeftClose` / `PanelLeftOpen`) to toggle sidebar visibility with one click.
- **Breadcrumbs**: `text-sm`, shows module code in `text-inksoft` followed by separator `/` and current page label in `font-medium text-ink`.
- **Search Bar**: `w-72 pl-8 pr-3 py-1.5 text-sm bg-surface border border-line rounded-md focus:ring-1 focus:ring-accent`.
- **User Avatar**: `w-8 h-8 rounded-full bg-accentsoft text-accent text-xs font-semibold`.

### 3. Main Workspace (`<div className="flex-1 flex flex-col min-w-0 transition-all ${sidebarOpen ? 'md:pl-64' : 'pl-0'}">`)
- Main container automatically expands to full width (`pl-0`) when the sidebar is hidden, or offsets by `md:pl-64` when visible.
- Base container has `p-6` on `bg-surface`.

---

## 5. Standard Component Specifications

### 1. Page Header Block
Every module page starts with a uniform title block:
```jsx
<div className="mb-5">
  <h1 className="text-lg font-semibold text-ink">{Module Title}</h1>
  <p className="text-sm text-inksoft mt-1">{Module Description}</p>
</div>
```

### 2. Tab Navigation (`Tabs.jsx`)
Used when a module has multiple related entities (e.g. Sales contains Customers and Sales Orders):
- Container: `flex gap-1 border-b border-line mb-4`
- Tab item: `px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors`
- Active: `border-accent text-accent`
- Inactive: `border-transparent text-inksoft hover:text-ink`

### 3. Data Panel & Table (`ModulePanel.jsx`)
The core container for tabular data display:
- **Card Wrapper**: `bg-white border border-line rounded-md`
- **Toolbar**: `flex items-center justify-between px-4 py-3 border-b border-line`
  - Left: Title (`text-sm font-semibold text-ink`) + Record count counter (`text-xs text-inksoft`)
  - Right: Quick filter search (`w-48 pl-7 pr-2 py-1.5 text-xs bg-surface border border-line rounded-md`) + Primary CTA Button (`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-accent text-white hover:bg-accent/90`)
- **Table Grid**:
  - `<thead>`: `border-b border-line text-left text-xs text-inksoft uppercase tracking-wide`
  - `<th>`: `px-4 py-2 font-medium whitespace-nowrap`
  - `<tbody> <tr>`: `border-b border-line last:border-0 hover:bg-surface/60`
  - `<td>`: `px-4 py-2.5`
  - Monospace cells: `font-mono text-xs`
  - Numbers/Currencies: `text-right` with `align: "right"` in column definition
  - Row Actions: Right-aligned pencil and trash icons (`p-1.5 rounded hover:bg-surface text-inksoft hover:text-accent` / `hover:text-red`).

### 4. Status Badges (`StatusBadge.jsx`)
Compact semantic tags with rounded borders:
- Base class: `inline-flex items-center px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap`
- **Semantic Mappings**:
  - **Positive / Complete** (`Cleared`, `Delivered`, `Billed`, `Completed`, `Received`, `Active`, `Approved`, `Invoiced`, `Loaded`, `Dispatched`):
    `bg-accentsoft text-accent`
  - **In Progress / Pending** (`Open`, `In Process`, `Released`, `Created`, `On Leave`, `In Transit`, `Pending`):
    `bg-ambersoft text-amber`
  - **Negative / Attention** (`Overdue`, `Terminated`, `Cancelled`):
    `bg-redsoft text-red`
  - **Fallback / Neutral**: `bg-surface text-inksoft`

### 5. Metric Cards (`KpiCard.jsx`)
Overview statistics cards:
- Container: `bg-white border border-line rounded-md p-4 flex flex-col gap-1`
- Top row: Uppercase label (`text-xs font-medium text-inksoft uppercase tracking-wide`) + Lucide icon (`size={15} text-inksoft/60`)
- Metric value: `text-2xl font-semibold font-mono`
- Tone variants for value:
  - `default`: `text-ink`
  - `accent`: `text-accent`
  - `amber`: `text-amber`
  - `red`: `text-red`
- Bottom sublabel: `text-xs text-inksoft`

### 6. Modal Dialogs (`Modal.jsx`)
Popup dialog for creation and editing:
- Backdrop: `fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4`
- Window: `bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[85vh] flex flex-col`
- Header: `flex items-center justify-between px-5 py-4 border-b border-line`
  - Title: `text-sm font-semibold text-ink`
  - Close button: `text-inksoft hover:text-ink rounded p-1 hover:bg-surface`
- Content area: `p-5 overflow-y-auto`
- Keyboard support: Closes on `Escape` key automatically.

### 7. Entity Form (`EntityForm.jsx`)
Declarative form layout:
- Fields container: `flex flex-col gap-4`
- Label: `text-xs font-medium text-inksoft` with `<span className="text-red"> *</span>` for required fields.
- Input fields:
  - Text/Number/Date: `border border-line rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent`
  - Prefix support (e.g. `$`): `<span className="text-sm text-inksoft">$</span>` positioned beside input.
  - Dropdown (`<select>`): `border border-line rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent bg-white`
  - Textarea: `border border-line rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent rows={3}`
- Action footer:
  - Divider: `flex justify-end gap-2 pt-2 border-t border-line mt-2`
  - Cancel button: `px-3 py-1.5 text-sm rounded-md border border-line text-inksoft hover:bg-surface`
  - Submit button: `px-3 py-1.5 text-sm rounded-md bg-accent text-white hover:bg-accent/90 font-medium`

### 8. Custom Operational Forms (`LoadingSection.jsx` & `UnloadingSection.jsx`)
For specialized operational submodules (such as Transportation Loading & Unloading), dedicated high-density multi-column forms follow wireframe layouts directly while adopting the design tokens:
- **Card Enclosure**: `bg-white border border-line rounded-lg p-5 shadow-sm`
- **Header Row**: 3 columns: `L#` (mono), `Date` (mono), `PO#` (mono)
- **Origin / Destination Row**: Full width `From` location field (for Loading) or `to` destination field (for Unloading)
- **Item & Measurement Row**: 3 columns: `Item`, `Unit` dropdown, and `Weight` (right-aligned numeric)
- **Financial Calculation Rows**:
  - `Price` and auto-calculated `Total` (`weight * price`)
  - `Labour`, `lbr/Rate`, and auto-calculated `Labour Total` (`weight * labourRate`)
  - `Tractor`, `Trac/Rate`, and auto-calculated `Tractor Total` (`weight * tractorRate`)
  - For Unloading: `Vehicle`, `Veh/Rate`, and auto-calculated `Vehicle Total` (`weight * vehicleRate`)
- **Footer Row**: Primary submit button using the standard ERP button component (`bg-accent text-white hover:bg-accent/90 rounded-md px-4 py-2 text-sm font-medium transition-colors shadow-sm`).
- **Layout Arrangement**: Displayed side-by-side (`grid grid-cols-1 xl:grid-cols-2 gap-6`) in the "Loading / Unloading" submodule.

### 9. Journal Voucher Entry Form (`JvEntryForm.jsx`)
Located within Financial Accounting (`FI`) / General Ledger / JV Voucher:
- **Wireframe Inspiration**: Modeled directly after the multi-column layout in `context/design/JV.png`.
- **Screen-Filling Pop-up & Backdrop Blur**:
  - Backdrop uses `fixed inset-0 z-50 bg-ink/50 backdrop-blur-md` to blur the background page content.
  - Form container spans the whole screen (`w-full h-full max-w-[98vw] max-h-[96vh] rounded-lg shadow-2xl bg-white border border-line`).
- **Layout & Structure**:
  - Header: `JV#` (mono text input) on the left, `Date` on the right.
  - Enclosed Account Card: Contains account rows with columns for `Account Head` (with GL autocomplete), `Narration`, and separate `Credit` and `Debit` numeric input boxes.
  - Line Actions: `Add an account` button inside the card to append new account rows dynamically.
  - Footer Totals Bar: Left shows `Total` and real-time Balance status (`Balanced ✓` or `Out of balance by $X`), and right shows two distinct side-by-side boxes for `Credit Total` and `Debit Total` aligned directly under their respective columns.
  - Actions: Standard ERP `Post JV Voucher` button (`bg-accent text-white hover:bg-accent/90 rounded-md`) with balance verification.

### 10. Bank Transfer Submodule (`BankTransferSection.jsx`)
Located within Financial Accounting (`FI`) / General Ledger / Bank Transfer:
- **Module Tag**: SAP-style `FI-BT` code badge.
- **Role**: Manages inter-account liquidity transfers, escrow disbursements, and bank settlement.
- **Integration**: Works alongside Chart of Accounts and JV Voucher sections within General Ledger.
- **Empty State**: Follows the utilitarian empty-state layout with centered icon, descriptive guidance, and ready-to-configure action triggers.

### 11. Data Visualizations & Charts (`DashboardCharts.jsx`)
Recharts configurations aligned with design tokens:
- **Palette**: `#0f7a72` (accent bar/pie slice), `#dfe3ea` (comparison bar/grid), `#b5790a` (amber pie slice), `#b3261e` (red pie slice), `#5b6472` (slate pie slice).
- **Grid Lines**: `stroke="#dfe3ea"`, `strokeDasharray="3 3"`, vertical or horizontal disabled to keep clean look.
- **Axes**: Tick labels use `fontSize: 11, fill: "#5b6472"`, tick lines hidden (`tickLine={false}`).
- **Tooltips**: Rounded border `borderRadius: 6, borderColor: "#dfe3ea"`, font size 12.

---

## 6. Data Formatting Standards

Consistency in formatting raw data values is critical across all tables and cards:

```javascript
// Currency: $1,250.00 or $1,250 (compact)
const currency = (n, digits = 0) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: digits,
  }).format(n || 0);

// Numbers with thousands separators: 1,500
const num = (n) =>
  new Intl.NumberFormat("en-US").format(n || 0);

// Dates: ISO YYYY-MM-DD string, rendered with mono styling
<span className="font-mono text-xs">{row.date}</span>
```

### Threshold Warning Pattern
When a numeric value breaches an operational threshold (e.g., inventory below reorder point):
```jsx
<span className={`inline-flex items-center gap-1 justify-end w-full ${stockQty <= reorderPoint ? "text-red" : ""}`}>
  {stockQty <= reorderPoint && <AlertTriangle size={12} />}
  {num(stockQty)}
</span>
```

---

## 7. Step-by-Step Guide: Adding a New Entity or Module

When creating a new module or adding an entity, follow this 4-step checklist to adhere to the design rules:

### Step 1: Create Seed Data File
Create `src/data/<entityPlural>.json` containing an array of records with unique string IDs (`"1"`, `"2"`, ...):
```json
[
  {
    "id": "1",
    "code": "QM-001",
    "name": "Incoming Raw Material Inspection",
    "status": "Active"
  }
]
```

### Step 2: Register API Route
Create `src/app/api/<entity-route>/route.js` and `[id]/route.js` using `apiFactory.js`:
```javascript
// src/app/api/inspections/route.js
import { createCrudHandlers } from "@/lib/apiFactory";
export const { GET, POST } = createCrudHandlers("inspections");

// src/app/api/inspections/[id]/route.js
import { createItemHandlers } from "@/lib/apiFactory";
export const { PUT, DELETE } = createItemHandlers("inspections");
```

### Step 3: Create Module Page with Form & Column Config
Create `src/app/<module>/page.jsx` defining:
1. `columns`: key, header label, optional `mono: true`, optional `align: "right"`, optional `render(row)`.
2. `fields`: name, label, type (`text` | `number` | `date` | `select` | `textarea`), required, options.
3. `searchKeys`: array of object keys used for real-time text filtering.

```jsx
"use client";

import ModulePanel from "@/components/ModulePanel";
import StatusBadge from "@/components/StatusBadge";

const columns = [
  { key: "code", header: "Inspection Code", mono: true },
  { key: "name", header: "Inspection Name" },
  { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
];

const fields = [
  { name: "code", label: "Inspection Code", type: "text", required: true },
  { name: "name", label: "Inspection Name", type: "text", required: true },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: ["Active", "Open", "Completed"],
    required: true,
  },
];

export default function QualityPage() {
  return (
    <div>
      <div className="mb-5">
        <h1 className="text-lg font-semibold text-ink">Quality Management</h1>
        <p className="text-sm text-inksoft mt-1">Inspection lots and quality certifications.</p>
      </div>

      <ModulePanel
        endpoint="inspections"
        title="Inspection Lots"
        entityLabel="Inspection"
        fields={fields}
        columns={columns}
        searchKeys={["code", "name", "status"]}
      />
    </div>
  );
}
```

### Step 4: Register Navigation Item in Shell
Open `src/components/Shell.jsx` and append the new route to the `NAV` array:
```javascript
import { CheckSquare } from "lucide-react";

const NAV = [
  // ... existing items
  { href: "/quality", label: "Quality Management", code: "QM", icon: CheckSquare },
];
```

---

## 8. Design Consistency Checklist

Before submitting or reviewing any new UI changes, verify:
- [ ] Are all primary buttons using `bg-accent text-white hover:bg-accent/90 rounded-md`?
- [ ] Are all borders using `border-line` (`#dfe3ea`)?
- [ ] Are monetary figures right-aligned and formatted via `Intl.NumberFormat` with currency symbols?
- [ ] Are ID codes, dates, and order numbers styled with `font-mono text-xs`?
- [ ] Are status badges using the designated color mappings from `StatusBadge.jsx`?
- [ ] Does the page follow the standard header layout (`h1` + descriptive `p` with `mb-5`)?
- [ ] Is the module registered with an SAP-style 2-4 letter uppercase code in `Shell.jsx`?
- [ ] Are required form fields marked with `<span className="text-red"> *</span>`?
