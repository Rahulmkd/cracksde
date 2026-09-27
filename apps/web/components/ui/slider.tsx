"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number | number[];
  defaultValue?: number | number[];
  onChange?: (value: number) => void;
  onValueChange?: (value: number[]) => void;
  className?: string;
  disabled?: boolean;
}

export function Slider({
  min = 0,
  max = 12,
  step = 1,
  value: controlledValue,
  defaultValue = 4,
  onChange,
  onValueChange,
  className,
  disabled = false,
}: SliderProps) {
  const getNumericVal = (val: number | number[] | undefined, fallback: number = 4): number => {
    if (Array.isArray(val)) return val[0] ?? fallback;
    if (typeof val === "number") return val;
    return fallback;
  };

  const [internalValue, setInternalValue] = React.useState(getNumericVal(defaultValue));
  const currentNum = controlledValue !== undefined ? getNumericVal(controlledValue) : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = Number(e.target.value);
    setInternalValue(newVal);
    onChange?.(newVal);
    onValueChange?.([newVal]);
  };

  const percentage = max > min ? ((currentNum - min) / (max - min)) * 100 : 0;

  return (
    <div className={cn("relative flex items-center w-full touch-none select-none py-2", className)}>
      <div className="relative w-full h-2 rounded-full bg-zinc-800/90 overflow-hidden">
        {/* Fill Track */}
        <div
          className="absolute left-0 top-0 h-full bg-primary rounded-full transition-all duration-75"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Thumb representation */}
      <div
        className="absolute h-4 w-4 -ml-2 rounded-full border-2 border-primary bg-background shadow-md pointer-events-none transition-all duration-75"
        style={{ left: `${percentage}%` }}
      />

      {/* Hidden Native Range Input for accessibility & smooth interaction */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={currentNum}
        disabled={disabled}
        onChange={handleChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
      />
    </div>
  );
}
