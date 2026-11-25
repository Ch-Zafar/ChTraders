"use client";

import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "cn";
import { Tabs as TabsPrimitive } from "radix-ui";

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn(
        "group/tabs flex gap-2 data-horizontal:flex-col",
        className
      )}
      {...props}
    />
  );
}

const tabsListVariants = cva(
  "group/tabs-list inline-flex items-center",
  {
    variants: {
      variant: {
        default:
          "w-fit justify-center rounded-lg bg-muted p-1 text-muted-foreground",
        line:
          "w-full justify-start gap-1 border-b border-line bg-transparent p-0 rounded-none",
      },
    },
    defaultVariants: {
      variant: "line",
    },
  }
);

function TabsList({
  className,
  variant = "line",
  ...props
}) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
        // Default pill variant
        "group-data-[variant=default]/tabs-list:rounded-md group-data-[variant=default]/tabs-list:px-3 group-data-[variant=default]/tabs-list:py-1.5 group-data-[variant=default]/tabs-list:data-[state=active]:bg-white group-data-[variant=default]/tabs-list:data-[state=active]:text-ink group-data-[variant=default]/tabs-list:data-[state=active]:shadow-xs",
        // Line / underline ERP variant (DESIGN.md Section 5.2)
        "group-data-[variant=line]/tabs-list:px-4 group-data-[variant=line]/tabs-list:py-2.5 group-data-[variant=line]/tabs-list:border-b-2 group-data-[variant=line]/tabs-list:-mb-px group-data-[variant=line]/tabs-list:border-transparent group-data-[variant=line]/tabs-list:text-inksoft hover:group-data-[variant=line]/tabs-list:text-ink",
        "group-data-[variant=line]/tabs-list:data-[state=active]:border-accent group-data-[variant=line]/tabs-list:data-[state=active]:text-accent group-data-[variant=line]/tabs-list:data-[state=active]:font-semibold",
        className
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 text-sm outline-none mt-2", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants };
