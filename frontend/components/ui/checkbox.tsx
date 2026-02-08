"use client";

import * as React from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<
  HTMLButtonElement,
  Omit<
    React.ComponentPropsWithoutRef<"button">,
    "checked" | "onCheckedChange" | "value"
  > & {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
  }
>(({ className, checked = false, onCheckedChange, ...props }, ref) => (
  <button
    type="button"
    role="checkbox"
    aria-checked={checked}
    ref={ref}
    onClick={() => onCheckedChange?.(!checked)}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-slate-200 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-slate-900 data-[state=checked]:text-slate-50",
      checked ? "bg-slate-900 text-white border-slate-900" : "bg-transparent",
      className
    )}
    {...props}
  >
    <div
      className={cn(
        "flex items-center justify-center text-current",
        !checked && "hidden"
      )}
    >
      <Check className="h-3 w-3" strokeWidth={3} />
    </div>
  </button>
));

Checkbox.displayName = "Checkbox";
export { Checkbox };
