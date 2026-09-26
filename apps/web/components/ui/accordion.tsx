"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionContextType {
  openItems: string[];
  toggleItem: (value: string) => void;
  type?: "single" | "multiple";
}

const AccordionContext = React.createContext<AccordionContextType | null>(null);

export function Accordion({
  children,
  type = "multiple",
  defaultValue = [],
  className,
}: {
  children: React.ReactNode;
  type?: "single" | "multiple";
  defaultValue?: string[];
  className?: string;
}) {
  const [openItems, setOpenItems] = React.useState<string[]>(defaultValue);

  const toggleItem = (value: string) => {
    if (type === "single") {
      setOpenItems((prev) => (prev.includes(value) ? [] : [value]));
    } else {
      setOpenItems((prev) =>
        prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]
      );
    }
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, type }}>
      <div className={cn("space-y-2", className)}>{children}</div>
    </AccordionContext.Provider>
  );
}

export function AccordionItem({
  value,
  className,
  children,
}: {
  value: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      data-value={value}
      className={cn("rounded-lg border border-zinc-800/80 bg-zinc-900/40 overflow-hidden", className)}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { value } as Record<string, unknown>);
        }
        return child;
      })}
    </div>
  );
}

export function AccordionTrigger({
  value,
  className,
  children,
  onClick,
}: {
  value?: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const context = React.useContext(AccordionContext);
  const isOpen = value ? context?.openItems.includes(value) : false;

  return (
    <button
      type="button"
      onClick={() => {
        if (value) context?.toggleItem(value);
        onClick?.();
      }}
      className={cn(
        "flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-800/40",
        className
      )}
    >
      <div className="flex items-center gap-3 w-full text-left">{children}</div>
      <ChevronDown
        className={cn(
          "h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-200",
          isOpen && "rotate-180"
        )}
      />
    </button>
  );
}

export function AccordionContent({
  value,
  className,
  children,
}: {
  value?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const context = React.useContext(AccordionContext);
  const isOpen = value ? context?.openItems.includes(value) : false;

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "border-t border-zinc-800/60 bg-zinc-950/60 px-4 py-3 text-xs text-zinc-300 animate-in fade-in-0 duration-150",
        className
      )}
    >
      {children}
    </div>
  );
}
