"use client";

import * as React from "react";
import { cn } from "cn";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { Check } from "lucide-react";

function Checkbox({ className, ...props }) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer size-4 shrink-0 rounded border border-line bg-white transition-all outline-none",
        "hover:border-inksoft/60 focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:border-accent",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:bg-accent data-[state=checked]:border-accent data-[state=checked]:text-white",
        "data-[state=indeterminate]:bg-accent data-[state=indeterminate]:border-accent data-[state=indeterminate]:text-white",
        "cursor-pointer shadow-2xs",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current"
      >
        <Check className="size-3.5 stroke-[2.5]" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
