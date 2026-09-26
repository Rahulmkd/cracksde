"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
  id?: string;
}

export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ checked = false, onCheckedChange, className, disabled = false, id }, ref) => {
    return (
      <button
        type="button"
        role="checkbox"
        id={id}
        ref={ref}
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onCheckedChange?.(!checked)}
        className={cn(
          "peer h-4 w-4 shrink-0 rounded border border-zinc-700 bg-zinc-900 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50",
          checked && "border-blue-600 bg-blue-600 text-white",
          className
        )}
      >
        {checked && (
          <Check className="h-3 w-3 text-white stroke-[3] mx-auto" />
        )}
      </button>
    );
  }
);
Checkbox.displayName = "Checkbox";
