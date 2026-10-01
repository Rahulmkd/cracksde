"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogContextType {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DialogContext = React.createContext<DialogContextType | null>(null);

export function Dialog({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onOpenChange(false);
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow || "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onOpenChange]);

  if (!open || !mounted) return null;

  return createPortal(
    <DialogContext.Provider value={{ open, onOpenChange }}>
      <div
        className="fixed inset-0 z-50 flex min-h-full items-center justify-center p-4 sm:p-6 overflow-y-auto pointer-events-none"
        role="dialog"
        aria-modal="true"
      >
        {/* Full-screen Backdrop Overlay */}
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in-0 duration-150 pointer-events-auto"
          onClick={() => onOpenChange(false)}
          aria-hidden="true"
        />

        {/* Centered Modal Container */}
        <div className="relative z-10 w-full flex items-center justify-center my-auto pointer-events-auto animate-in zoom-in-95 fade-in-0 duration-150">
          {children}
        </div>
      </div>
    </DialogContext.Provider>,
    document.body
  );
}

export interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  hideCloseButton?: boolean;
}

export function DialogContent({
  className,
  children,
  hideCloseButton = false,
  ...props
}: DialogContentProps) {
  const context = React.useContext(DialogContext);

  return (
    <div
      className={cn(
        "relative mx-auto w-full rounded-xl border border-zinc-800 bg-zinc-950 p-5 sm:p-6 shadow-dialog text-zinc-100",
        className
      )}
      onClick={(e) => e.stopPropagation()}
      {...props}
    >
      {!hideCloseButton && (
        <button
          type="button"
          onClick={() => context?.onOpenChange(false)}
          className="absolute right-4 top-4 rounded-md p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors focus:outline-none z-10"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      {children}
    </div>
  );
}

export function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col space-y-1 text-left mb-4", className)}
      {...props}
    />
  );
}

export function DialogTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn("text-[18px] font-semibold leading-[1.3] text-zinc-100", className)}
      {...props}
    />
  );
}

export function DialogDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-[13px] font-normal text-zinc-400 leading-[1.45]", className)}
      {...props}
    />
  );
}

export function DialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 sm:gap-0 mt-5 pt-3 border-t border-zinc-800/60",
        className
      )}
      {...props}
    />
  );
}
