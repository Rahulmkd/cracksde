"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
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
  className,
  disabled = false,
}: SliderProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = Number(e.target.value);
    setInternalValue(newVal);
    onChange?.(newVal);
  };

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn("relative flex items-center w-full touch-none select-none", className)}>
      <div className="relative w-full h-2 rounded-full bg-zinc-800/90 overflow-hidden">
        {/* Fill Track */}
        <div
          className="absolute left-0 top-0 h-full bg-blue-600 rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Thumb representation */}
      <div
        className="absolute h-4 w-4 -ml-2 rounded-full border-2 border-blue-500 bg-white shadow-md pointer-events-none transition-all"
        style={{ left: `${percentage}%` }}
      />

      {/* Hidden Native Range Input for accessibility & smooth interaction */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={handleChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
      />
    </div>
  );
}
