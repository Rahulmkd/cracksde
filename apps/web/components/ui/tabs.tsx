"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TabsContextType {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextType | null>(null);

export function Tabs({
  value,
  defaultValue = "",
  onValueChange,
  children,
  className,
}: {
  value?: string;
  defaultValue?: string;
  onValueChange?: (val: string) => void;
  children: React.ReactNode;
  className?: string;
}) {
  const [internalVal, setInternalVal] = React.useState(defaultValue);
  const currentVal = value !== undefined ? value : internalVal;

  const handleChange = (val: string) => {
    setInternalVal(val);
    onValueChange?.(val);
  };

  return (
    <TabsContext.Provider value={{ value: currentVal, onValueChange: handleChange }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "inline-flex h-9 items-center justify-center rounded-lg bg-zinc-900/70 p-1 text-zinc-400 border border-zinc-800/80 gap-1",
        className
      )}
      {...props}
    />
  );
}

export function TabsTrigger({
  value,
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }) {
  const context = React.useContext(TabsContext);
  const isActive = context?.value === value;

  return (
    <button
      type="button"
      onClick={() => context?.onValueChange(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-xs font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50",
        isActive
          ? "bg-zinc-800 text-zinc-100 shadow-sm font-semibold"
          : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  value,
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { value: string }) {
  const context = React.useContext(TabsContext);
  if (context?.value !== value) return null;

  return (
    <div
      className={cn("mt-4 focus-visible:outline-none animate-in fade-in-0 duration-150", className)}
      {...props}
    >
      {children}
    </div>
  );
}
